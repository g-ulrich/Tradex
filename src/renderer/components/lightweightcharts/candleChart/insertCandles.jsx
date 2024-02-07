import React, {useState, useEffect} from 'react';
import {
  chartColors,
} from "../options";
import {
  LineSeries,
  BarSeries,
  CandlestickSeries,
} from "lightweight-charts-react-wrapper";
import AreaChartType from './areaChartType';
import {
  candleToLineChart,
} from "../util";
import {
  convertDatetimeToEpoch
} from "../../../tools/util";
import {
  seriesColors,
} from "../options";
import { MarketData } from '../../../api/tradestation/marketData';

export default function InsertCandles({chartRef, candles, orderHistory, chartType, candleKey, visRange}){
  const [markers, setMarkers] = useState([]);
  const isProfiting = candles[visRange.from][candleKey] <= candles[visRange.to === -1 ? candles.length-1:visRange.to][candleKey];

  function findClosestEpochIndex(jsonArray, givenEpoch) {
    var array = [];
    for (let i = 0; i < jsonArray.length; i++) {
      array.push(Math.abs(givenEpoch-jsonArray[i].time));
    }
    let smallestNumber = array[0];
    var smallestIndex = 0;
    for (let i = 1; i < array.length; i++) {
      if (array[i] < smallestNumber) {
        smallestNumber = array[i];
        smallestIndex = i;
      }
    }
    return smallestIndex;
  }

  useEffect(() => {
    if (orderHistory !== null || orderHistory.length > 0) {
      console.log(orderHistory);
      // get all orders that have been filled.
      // const orders = orderHistory.map((order)=>{
      //   if (order?.Status === 'FLL'){return order;}
      // });
      const legs = orderHistory.map((order)=>{
        try {
          return{...order,
            BuyOrSell: order.Legs[0]?.BuyOrSell,
            QuantityOrdered: order.Legs[0]?.QuantityOrdered
          }
        }catch (error) {
          console.error("insertcandles legs", error);
        }
      });
      const setMarkerPos = (orderDT) => {
        const old_epoch = new Date(orderDT).getTime();
        const new_epoch = old_epoch + ((-5 * 60) * 60 * 1000); // utc to est
        return candles[findClosestEpochIndex(candles, new_epoch/1000)].time;
      }
      const markersArray = legs.map((order)=>{

        return { time: setMarkerPos(typeof order?.ClosedDateTime === 'undefined' ? order?.OpenedDateTime : order?.ClosedDateTime),
          position: order?.BuyOrSell !== 'Buy' ? 'aboveBar' : 'belowBar',
          color: order?.BuyOrSell !== 'Buy' ? '#e91e63' :  '#2196F3',
          shape: order?.BuyOrSell !== 'Buy' ? 'arrowDown' : 'arrowUp',
          text: (order?.BuyOrSell !== 'Buy' ?
                   order?.BuyOrSell : 'Buy') +
                    `${order?.Status !== 'FLL' ? ` (${order?.Status})` : ' (FLL)'}` +
                     ` ${order?.QuantityOrdered} @ `+
                      `$${parseFloat(order?.FilledPrice === '0' ?
                        order?.LimitPrice :
                        order?.FilledPrice).toFixed(2)}`}
        });
      const compareTime = (a, b) => { return a.time - b.time;}
      const newMarkersArray = markersArray.sort(compareTime);
      setMarkers(newMarkersArray);
    }
  }, [orderHistory]);


  return(
    <>
      {chartType === "line" ? (
          <LineSeries
            ref={chartRef}
            data={candleToLineChart(candles, candleKey)}
            color={
                isProfiting ? seriesColors.green.line : seriesColors.blurple.line
            }
            lineWidth={2}
            markers={markers}
          />
        ) : chartType === "area" ? (
          <AreaChartType candles={candles}
            candleKey={candleKey}
            visRange={visRange}
            markers={markers}
            />
        ) : chartType === "bar" ? (
          <BarSeries
            ref={chartRef}
            data={candles}
            reactive={true}
            thinBars={false}
            markers={markers}
            downColor={chartColors.discord.blurple}
            upColor={chartColors.discord.softGreen}
          />
        ) : (
          <CandlestickSeries
          ref={chartRef}
          upColor={chartColors.discord.green}
          downColor={chartColors.discord.blurple}
          borderDownColor={chartColors.discord.blurple}
          borderUpColor={chartColors.discord.green}
          wickDownColor={chartColors.discord.blurple}
          wickUpColor={chartColors.discord.green}
          data={candles}
          markers={markers}
          reactive={true} />
        )}
    </>
  );
}
