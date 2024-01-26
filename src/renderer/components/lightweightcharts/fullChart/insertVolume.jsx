import {
  chartColors,
} from "../options";
import {
  HistogramSeries,
  PriceScale,
} from "lightweight-charts-react-wrapper";

export default function InsertVolume({candles}){
  return(
    <>
      <HistogramSeries
        data={candles.map((candle) => ({
          time: candle.time,
          value: candle.volume,
          color:
            candle.open > candle.close
              ? chartColors.softRed
              : chartColors.softGreen,
        }))}
        priceScaleId="overlay"
        priceFormat={{ type: "volume" }}
      />
      <PriceScale id="overlay" scaleMargins={{ top: 0.8, bottom: 0 }} />
    </>
  );
}
