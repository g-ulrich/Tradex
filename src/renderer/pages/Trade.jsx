import React, {useEffect, useState, useRef} from 'react';
import * as talib from '../components/lightweightcharts/talib';
import { ColorType, CrosshairMode } from 'lightweight-charts';

import {Chart, LineSeries, CandlestickSeries, HistogramSeries, PriceScale} from "lightweight-charts-react-wrapper";
import {data as OHLCV} from '../components/lightweightcharts/exampleData';
import {convertArrayToJsonArrayForChart,
    indicatorToLineChart,
    bollingerbandsToAreaSeriesJsonArr,
    csvToJsonArray} from '../components/lightweightcharts/util';

    const chartColors = {
      white: '#ffffff',
      softDarkGray: 'rgba(49,53,59, 0.9)',
      softWhite: 'rgba(100,100,100, 0.4)',
      softRed: 'rgba(200, 97, 100, .5)',
      softGreen: 'rgba(39, 157, 130, .5)',
      discord: {
        red: '#ED4245',
        softRed: 'rgba(237,66,69,.5)',
        green: 'rgb(87,242,135)',
        softGreen: 'rgba(87,242,135, .5)',
        white: '#f2f3f5',
        white2: '#d9dadc',
        blurple: '#7289DA',
        blurple2: '#5865f2',
        softBlurple2: 'rgba(88,101,242,.2)',
        darkGray: '#424549',
        darkerGray: '#36393E',
        darkestGray: '#282B30',
        black: '#1E2124',
      }
    }

    const primaryChartOptions = {
      // width: 500,
      // height: 400,
      layout: {
          textColor: chartColors.white,
          background: {
              color: chartColors.discord.darkestGray,
              type: ColorType.Solid,
          },
          fontSize: 12,
      },
      rightPriceScale: {
          scaleMargins: { top: 0.2, bottom: 0.2 },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
      crosshair: {
          mode: CrosshairMode.FinanceChart,
          vertLine: {
              labelBackgroundColor: chartColors.discord.darkerGray,
          },
          horzLine: {
              labelBackgroundColor: chartColors.discord.darkerGray,
          },
      },
      grid: {
          vertLines: { color: chartColors.softDarkGray },
          horzLines: { color: chartColors.softDarkGray },
      },
      handleScroll: { vertTouchDrag: true },
    };

    const secondaryChartOptions = {
      width: 500,
      height: 200,
      layout: {
          textColor: chartColors.white,
          background: {
              color: chartColors.discord.darkestGray,
              type: ColorType.Solid,
          },
          fontSize: 12,
      },
      rightPriceScale: {
          scaleMargins: { top: 0.2, bottom: 0.2 },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
      crosshair: {
          mode: CrosshairMode.FinanceChart,
          vertLine: {
              labelBackgroundColor: chartColors.discord.darkerGray,
          },
          horzLine: {
              labelBackgroundColor: chartColors.discord.darkerGray,
          },
      },
      grid: {
          vertLines: { color: chartColors.softDarkGray },
          horzLines: { color: chartColors.softDarkGray },
      },
      handleScroll: { vertTouchDrag: true },
    };

function Trade() {
  const containerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [candles, setCandles] = useState(null);

  useEffect(() => {
    setCandles(csvToJsonArray(OHLCV));
    // const taResults = talib['getEMA'](candles, 25);
    const resizeWidth = () => {
      if (containerRef.current) {
      setChartWidth(containerRef.current.clientWidth);
      }
    }
    resizeWidth();
    window.addEventListener('resize', resizeWidth);
    return () => {
      window.removeEventListener('resize', resizeWidth);
    };
  }, []);


    return (
      <div className="flex gap-2">
        <div ref={containerRef} className="grow min-w-[300px] sm:w-[100%]">
        <div className="w-full h-[600px] bg-discord-darkestGray rounded py-2">
          {candles !== null && containerRef !== null ? (
              <Chart width={chartWidth} height={600} {...primaryChartOptions}>
                <HistogramSeries
                  data={candles.map((candle) => ({
                    time: candle.time,
                    value: candle.volume,
                    color: candle.open > candle.close ?  chartColors.softRed : chartColors.softGreen
                  }))}
                  priceScaleId="overlay"
                  priceFormat={{type: 'volume'}}/>
                <PriceScale id="overlay" scaleMargins={{top: 0.8, bottom: 0}}/>
                <CandlestickSeries data={candles}/>
                <LineSeries data={indicatorToLineChart(candles, talib['getEMA'](candles, 25))}/>

              </Chart>
            ) : (
             <span className="text-center">
              Loading...
             </span>
            )
          }
          </div>
        </div>
      </div>
    );
}

export default Trade;
