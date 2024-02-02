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
  seriesColors,
} from "../options";

export default function InsertCandles({chartRef, candles, chartType, candleKey, visRange}){
  // const isProfiting = candles[visRange.from][candleKey] <= candles[visRange.to][candleKey];
  const isProfiting = false;
  return(
    <>
      {chartType === "line" ? (
          <LineSeries
            ref={chartRef}
            data={candleToLineChart(candles, candleKey)}
            color={
                isProfiting ? seriesColors.green.line : seriesColors.red.line
            }
            lineWidth={2}
            reactive={true}
          />
        ) : chartType === "area" ? (
          <AreaChartType candles={candles}
            candleKey={candleKey}
            visRange={visRange}/>
        ) : chartType === "bar" ? (
          <BarSeries
            ref={chartRef}
            data={candles}
            reactive={true}
            thinBars={false}
            downColor={chartColors.discord.blurple}
            upColor={chartColors.discord.softGreen}
          />
        ) : (
          <CandlestickSeries
          ref={chartRef}
          data={candles}
          reactive={true} />
        )}
    </>
  );
}
