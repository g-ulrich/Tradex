import React, { useEffect, useState } from "react";
import {
  Chart,
  LineSeries,
  PriceLine
} from "lightweight-charts-react-wrapper";
import {grpChartOptions} from '../options';
import ResizeChartWidth from '../resizeChartWidth';


export default function SubsequentChart({ containerRef, candles}) {
  const [chartWidth] = ResizeChartWidth(containerRef, 500);
  const height = 150;

  return (
    <>
    {
      candles.length > 0 ? (
        <Chart
        {...grpChartOptions({ width: chartWidth, height: height, timeVisible: true})}>
          <LineSeries
              lineWidth={1}
              data={[]}/>
          {/* {
            indicatorsSeries.forEach((obj, i)=>{
            <LineSeries
              key={`${obj.symbol}_${i}`}
              lineWidth={1}
              color={obj.color}
              data={obj.series}>

            <PriceLine
                price={70}
                color="#be1238"
                lineWidth={1}
                lineVisible={true}
            />
            <PriceLine
                price={30}
                color="#be1238"
                lineWidth={1}
                lineVisible={true}
            />
          </LineSeries>
            })
          } */}

      </Chart>
      ) : (<></>)
    }
    </>
  );
}
