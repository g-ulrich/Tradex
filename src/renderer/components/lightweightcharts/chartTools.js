import React from 'react';
import { GMTtoEST } from '../tools';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';

export const initChart = (containerRef, colorsObj) => {
    return createChart(containerRef, {
        width: containerRef.clientWidth || 500,
        height: containerRef.clientHeight,
        layout: {
            textColor: colorsObj.color,
            background: {
                color: colorsObj.backgroundColor,
                type: ColorType.Solid,
            },
            fontSize: 12,
        },
        rightPriceScale: {
            scaleMargins: { top: 0.3, bottom: 0.25 },
        },
        timeScale: { timeVisible: true, secondsVisible: false },
        crosshair: {
            mode: CrosshairMode.FinanceChart,
            vertLine: {
                labelBackgroundColor: 'rgb(46, 46, 46)',
            },
            horzLine: {
                labelBackgroundColor: 'rgb(55, 55, 55)',
            },
        },
        grid: {
            vertLines: { color: '#424549' },
            horzLines: { color: '#424549' },
        },
        handleScroll: { vertTouchDrag: true },
    });

}

export const initCandleSeries = (currentRef, TOHLC_Data, colorsObj) => {
    const candlesSeries = currentRef.addCandlestickSeries({
        color: colorsObj.color || 'rgb(0, 120, 255)',
        upColor: colorsObj.up,
        borderUpColor: colorsObj.up,
        wickUpColor: colorsObj.up,
        downColor: colorsObj.down,
        borderDownColor: colorsObj.down,
        wickDownColor: colorsObj.down,
        lineWidth: 2,
    });
    candlesSeries.setData(TOHLC_Data);
    candlesSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.2, bottom: 0.2 },
    });
    return candlesSeries;
}

export const initHistogramVolSeries = (currentRef, TOHLCV_Data, colorsObj) => {
    const volumeSeries = currentRef.addHistogramSeries({
        color: colorsObj.color || 'rgb(0, 120, 255)',
        priceFormat: { type: 'volume' },
        overlay: true,
        priceScaleId: 'volume_scale',
    });

    volumeSeries.setData(
        TOHLCV_Data.map((candle) => ({
            time: GMTtoEST(candle.datetime),
            value: candle.volume,
            color: candle.open > candle.close ? colorsObj.down : colorsObj.up,
        }))
    );

    volumeSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
    });
    return volumeSeries;
}

export const formatVolumeText = (num) => {
    const absNum = Math.abs(num);
    if (absNum >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (absNum >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString().padStart(8, ' ');
};

export const subscribeRangeChange = (containerRef) => {
    containerRef.timeScale().subscribeVisibleTimeRangeChange((visibleRange) => {
        console.log("Range Change");
        // if (visibleRange) {
        //     const { from, to } = visibleRange;
        //     const data = timeseries;
        //     if (to >= GMTtoEST(data[data.length - 1].datetime)) {
        //         console.log('On right', visibleRange);
        //     }
        //     if (from <= GMTtoEST(data[0].datetime)) {
        //         console.log('On left');
        //     }
        // }
    });
}

export const subscribeCrossHair = (chartRef, legendRef, props, candleColors, candlesSeries, volumeSeries) => {

    chartRef.subscribeCrosshairMove((param) => {
        if (param.time) {
            try {
                const candle = candlesSeries.data()[param.logical];
                const volume = volumeSeries.data()[param.logical];
                const color = candle.open > candle.close ? candleColors.down : candleColors.up;
                const arrow = candle.open > candle.close ? '▼' : '▲';
                const pl = `${(candle.close - candle.open).toFixed(2)} (${(((candle.close - candle.open) / candle.close) * 100).toFixed(2)}%)`;
                const main_legend = ['open', 'high', 'low', 'close']
                    .map((item) => `${item.charAt(0).toUpperCase()}<span style='color: ${color}'>${candle[item].toFixed(2)}</span> `)
                    .join('') + ` ${arrow} <span style="color: ${color}">${pl}</span>`;
    
                legendRef.innerHTML = `<b>${props.symbol}</b> <span style='font-size: 12px;'>${main_legend} Vol <span style='color: ${color}'>${formatVolumeText(volume.value)}</span></span>`;
            } catch (error) {
                console.log(error);
            }
        }
    });
}

// export const getCandleDataFromQuotes = (jsonArr, min) => {
//     console.log(jsonArr);
//     const timestampXMinutesAgo = Math.floor((Date.now() - (min * 60 * 1000)) / 60000) * 60000;

//     const filteredArray = [];
//     for (let i = 0; i < jsonArr.length; i++) {
//         const obj = jsonArr[i];
//         if (obj.quoteTimeInLong >= timestampXMinutesAgo) {
//             filteredArray.push(obj);
//         }
//     }

//     // find min/max
//     let maxVal = filteredArray[0].mark;
//     let minVal = filteredArray[0].mark;
//     for (let i = 1; i < filteredArray.length; i++) {
//         const markValue = filteredArray[i].mark;
//         maxVal = markValue > maxVal ? markValue : maxVal;
//         minVal = markValue < minVal ? markValue : minVal;
//     }
//     const date = new Date(filteredArray[filteredArray.length - 1].quoteTimeInLong);
//     date.setSeconds(0);
//     return {
//         time: date.getTime(),
//         open: filteredArray[0].mark,
//         high: maxVal,
//         low: minVal,
//         close: filteredArray[filteredArray.length - 1].mark,
//         volume: filteredArray[filteredArray.length - 1].totalVolume - filteredArray[0].totalVolume
//     };
// }