import {
  AreaSeries,
} from "lightweight-charts-react-wrapper";
import {
  candleToLineChart,
} from "../util";
import {
  seriesColors,
} from "../options";

export default function AreaChartType({candles, visRange, candleKey}){
  const isProfiting = candles[visRange.from][candleKey] <= candles[visRange.to][candleKey];
  return (
    <AreaSeries
        data={candleToLineChart(candles, candleKey)}
        topColor={
          isProfiting ? seriesColors.green.top : seriesColors.red.top
        }
        bottomColor={
          isProfiting ? seriesColors.green.bottom : seriesColors.red.bottom
        }
        lineColor={
          isProfiting ? seriesColors.green.line: seriesColors.red.line
        }
        lineWidth={0.5}
      />
  );
}
