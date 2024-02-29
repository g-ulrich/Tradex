import React, {useState, useEffect} from 'react';
import {
  chartColors,
} from "../options";
import {
  LineSeries,
  BarSeries,
  CandlestickSeries,
  AreaSeries
} from "lightweight-charts-react-wrapper";
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

export default function InsertCandles({chartRef, candles, orderHistory, chartType, candleKey, isProfiting}){
  const [markers, setMarkers] = useState([]);

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
    if (orderHistory.length > 0 && candles.length > 0) {

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
    {

    candles.length > 0 ? (<>
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
          <AreaSeries
            ref={chartRef}
            data={candleToLineChart(candles, candleKey)}
            topColor={
              isProfiting ? seriesColors.green.top : seriesColors.blurple.top
            }
            bottomColor={
              isProfiting ? seriesColors.green.bottom : seriesColors.blurple.bottom
            }
            lineColor={
              isProfiting ? seriesColors.green.line: seriesColors.blurple.line
            }
            lineWidth={0.5}
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
        </>) : (<></>)
        }
    </>
  );
}
