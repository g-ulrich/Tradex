import {
  chartColors,
} from "../options";
import {
  HistogramSeries,
  PriceScale,
} from "lightweight-charts-react-wrapper";

export default function InsertVolume({volumeRef, candles}){
  return(
    <>
    {candles.length > 0 ? (
        <>
        <HistogramSeries
        reactive={true}
        ref={volumeRef}
        data={candles.map((candle) => ({
          time: candle.time,
          value: candle.volume,
          color:
            candle.open > candle.close
              ? chartColors.softBlurple
              : chartColors.softGreen,
        }))}
        priceScaleId="overlay"
        priceFormat={{ type: "volume" }}
      />
      <PriceScale id="overlay" scaleMargins={{ top: 0.8, bottom: 0 }} />
        </>
    ) : (<></>)}

    </>
  );
}
