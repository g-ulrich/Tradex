import React, { useEffect, useRef, useState } from 'react';
// import { skeletonGraph } from '../skeletons';
import { initChart, initCandleSeries, initHistogramVolSeries,getCandleDataFromQuotes, subscribeCrossHair, formatVolumeText, subscribeRangeChange } from './chartTools';
import { getCurrentTime, isCurTimeDivisibleByMinsWithTolerance, generateAlphaNumString, YTDInDays, GMTtoEST, ESTToGMT, getIndexByVal } from '../util';
import axios from 'axios';

const FinanceChart = ( props ) => {
    const chartHeight = props.height || '400px';
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const chartLegendsRef = useRef(null);
    const [selectedTimeFrameKey, setSelectedTimeFrameKey] = useState(props.timeFrame);
    const timeFrames = { 'Live': 2, '5D': 5, '1M': 30, '3M': 31 * 3, '6M': 31 * 6, 'YTD': YTDInDays(), '1Y': 365, '5Y': 365 * 5, 'All': 365 * 20 };
    const [timeFrameValInDays, setTimeFrameValInDays] = useState(timeFrames[props.timeFrame]);
    const [refresh, setRefresh] = useState(generateAlphaNumString(5));
    const [chartTypeIcon, setChartTypeIcon] = useState('bi bi-graph-up');
    const [quotes, setQuotes] = useState([]);
    const [timeseries, setTimeseries] = useState(null);
    const seriesUpdateIntervalms = 5000;
    const pane = {
        backgroundColor: '#36393e',
        hoverBackgroundColor: '#3c434c',
        clickBackgroundColor: '#50565E',
        activeBackgroundColor: 'rgba(0, 122, 255, 0.7)',
        mutedBackgroundColor: 'rgba(0, 122, 255, 0.3)',
        borderColor: '#3C434C',
        color: '#d8d9db',
        activeColor: '#ececed',
    };
    const candleColors = {
        up: 'rgba(39, 157, 130, 100)',
        down: 'rgba(200, 97, 100, 100)',
        color: 'rgb(0, 120, 255)' // blue
    };
    const volumeColors = {
        up: 'rgba(39, 157, 130, .5)',
        down: 'rgba(200, 97, 100, .5)',
        color: 'rgb(0, 120, 255)' // blue
    };

    const chartTypeCallBack = () => {
        setChartTypeIcon(chartTypeIcon == 'bi bi-bar-chart-steps -rotate-90' ? 'bi bi-graph-up' : 'bi bi-bar-chart-steps -rotate-90');
    };

    const frequencyCallback = () => {
        setRefresh(generateAlphaNumString(5));
    };

    // getting and setting timeSeries from api
    const getTimeseriesData = async () => {
        try {
            console.log(timeFrameValInDays);
            // const days = timeFrameValInDays || timeFrames[selectedTimeFrameKey];
            // const isDaily = days > 31 * 6;
            // const payLoad = {
            //     symbol: props.symbol,
            //     minute: selectedTimeFrameKey == 'Live' ? 1 : selectedTimeFrameKey == '3M' || selectedTimeFrameKey == '6M' ? 30 : selectedTimeFrameKey == '5D' ? 5 : timeFrameValInDays,
            //     days: days,
            //     from_last_close: false,
            //     ext: false,
            //     current: false,
            //     max: false
            // };
            // const response = await axios.post(isDaily ? 'daily_history' : 'intraday_history', { data: payLoad });
            // const data = JSON.parse(response.data.df);
            return [];
        } catch (error) {
            console.log(error);
        }
    };


    const updateSeries = async (candlesSeries, volumeSeries) => {
        try {
            if (timeseries && chartRef.current) {
                const freq = selectedTimeFrameKey == 'Live' ? 1 : selectedTimeFrameKey == '3M' || selectedTimeFrameKey == '6M' ? 30 : selectedTimeFrameKey == '5D' ? 5 : timeFrameValInDays;
                const existingCandles = candlesSeries.data();
                const existingVolumes = volumeSeries.data();
                if (isCurTimeDivisibleByMinsWithTolerance(freq, seriesUpdateIntervalms / 1000)) {
                    console.log('new candle');
                    setTimeFrameValInDays(1);
                    const data = await getTimeseriesData();
                    const lastBar = data[data.length - 1];
                    const existingCandles = candlesSeries.data();
                    existingCandles.push({ time: GMTtoEST(lastBar.datetime), open: lastBar.open, high: lastBar.high, low: lastBar.low, close: lastBar.close });
                    candlesSeries.setData(existingCandles);
                    existingVolumes.push({ time: GMTtoEST(lastBar.datetime), value: lastBar.volume, color: lastBar.open < lastBar.close ? volumeColors.up : volumeColors.down })
                    volumeSeries.setData(existingVolumes);

                } else {
                    console.log('update candle');
                    const response = await axios.post('get_quote', { data: {symbol: props.symbol} });
                    const data = response.data.df;
                    const lastBar = existingCandles[existingCandles.length - 1];
                    // quotes.push(data)
                    // setQuotes(quotes);
                    // console.log(getCandleDataFromQuotes(quotes, freq));
                    console.log(data);
                    candlesSeries.update({ ...lastBar, time: lastBar.time, close: data.mark });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    // if refresh, then new data will get fetched and resize event will happen
    useEffect(() => {
        const fetchData = async () => {
            const data = await getTimeseriesData();
            setTimeseries(data);
        };

        const resizeHandler = () => {
            if (chartRef.current) {
                chartRef.current.resize(chartContainerRef.current.clientWidth, 500);
            }
        };

        window.addEventListener('resize', resizeHandler);
        // setTimeseries(null);
        fetchData();
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, [refresh]);


    useEffect(() => {
        chartRef.current = initChart(chartContainerRef.current, pane);
        var candlesSeries;
        var volumeSeries;
        if (timeseries) {
            const chartData = timeseries;
            const TOHLC_Data = chartData.map(({ datetime, close, open, low, high }) => ({
                time: GMTtoEST(datetime), close, open, low, high,
            }));
            candlesSeries = initCandleSeries(chartRef.current, TOHLC_Data, candleColors);
            volumeSeries = initHistogramVolSeries(chartRef.current, chartData, volumeColors);

        }
        subscribeCrossHair(chartRef.current, chartLegendsRef.current, props, candleColors, candlesSeries, volumeSeries);
        // chartRef.current.subscribeCrosshairMove((param) => {
        //     if (param.time) {
        //         try {
        //             const candle = candlesSeries.data()[param.logical];
        //             const volume = volumeSeries.data()[param.logical];
        //             const color = candle.open > candle.close ? candleColors.down : candleColors.up;
        //             const arrow = candle.open > candle.close ? '▼' : '▲';
        //             const pl = `${(candle.close - candle.open).toFixed(2)} (${(((candle.close - candle.open) / candle.close) * 100).toFixed(2)}%)`;
        //             const main_legend = ['open', 'high', 'low', 'close']
        //                 .map((item) => `${item.charAt(0).toUpperCase()}<span style='color: ${color}'>${candle[item].toFixed(2)}</span> `)
        //                 .join('') + ` ${arrow} <span style="color: ${color}">${pl}</span>`;

        //             chartLegendsRef.current.innerHTML = `<b>${props.symbol}</b> <span style='font-size: 12px;'>${main_legend} Vol <span style='color: ${color}'>${formatVolumeText(volume.value)}</span></span>`;
        //         } catch (error) {
        //             console.log(error);
        //         }
        //     }
        // });

        subscribeRangeChange(chartRef.current);

        const fetchQuote = async (candlesSeries, volumeSeries) => {
            await updateSeries(candlesSeries, volumeSeries);
        };

        const interval_5ms = setInterval(() => {
            fetchQuote(candlesSeries, volumeSeries);
        }, seriesUpdateIntervalms);

        return () => {
            clearInterval(interval_5ms);
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [timeseries]);

    return (<div>
        <div className="rounded bg-discordGray p-2">
            <div className="z-[999] absolute " ref={chartLegendsRef}></div>
            <div ref={chartContainerRef} style={{ height: chartHeight }}></div>

            <div className=" border-t border-discordDarkGray pt-[3px]">

                <div className="grid grid-cols-12 gap-2 w-full">
                    <div className="col-span-6">
                        <ul className="flex items-center -space-x-px h-8 text-sm">
                            {Object.keys(timeFrames).map((key) => (
                                <li>
                                    <a onClick={() => (setSelectedTimeFrameKey(key), setTimeFrameValInDays(timeFrames[key]), frequencyCallback())}
                                        className={`flex items-center justify-center px-3 h-8 leading-tight hover:bg-discordDarkGray focus:border-b focus:border-discordPurple focus:text-discordPurple focus:animate-pulse ${selectedTimeFrameKey == key ? 'border-b border-discordPurple text-discordPurple animate-pulse' : ''}`}>{key}</a>
                                </li>
                            ))}
                            <li>
                                <a onClick={() => (chartTypeCallBack())} class={`flex items-center justify-center px-3 h-8 leading-tight hover:bg-discordDarkGray `}><i class={`${chartTypeIcon}`}></i></a>
                            </li>

                        </ul>
                    </div>
                    <div className="col-span-6 text-right my-auto text-sm px-3">
                        <span className={`${timeseries === null ? 'hidden' : ''}`}>{getCurrentTime()} (EST)</span>
                        <div role="status" className={`${timeseries === null ? '' : 'hidden'}`}>
                            <svg aria-hidden="true" class="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default FinanceChart;
