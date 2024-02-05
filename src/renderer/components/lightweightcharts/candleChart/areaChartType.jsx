import {
  AreaSeries,
} from "lightweight-charts-react-wrapper";
import {
  candleToLineChart,
} from "../util";
import {
  seriesColors,
} from "../options";

export default function AreaChartType({chartRef, candles, visRange, candleKey, markers}){
  const isProfiting = candles[visRange.from][candleKey] <= candles[visRange.to][candleKey];
  return (
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
  );
}
