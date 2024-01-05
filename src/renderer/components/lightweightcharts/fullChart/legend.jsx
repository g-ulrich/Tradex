import React, { useState } from "react";
import {
  IconInifnity,
  IconRangeArrows,
  IconX,
  IconEye,
} from "../../Icons";
import {
  chartColors,
} from "../options";
import {
  formatVolume,
  getVisRange
} from "../util";

export default function ChartLegend({candles, chartref, moveindex, studies}) {
  const [activeStudy, setActiveStudy] = useState(null);

  const getLegendVals = (index) => {
    // legend values for OHLCV
    const range = getVisRange(candles, chartref);
    const candleDiff = (candles[index]?.close - candles[index]?.open).toFixed(
      2
    );
    const candleCalc = `${candleDiff} (${(
      (candleDiff / candles[index]?.open) *
      100
    ).toFixed(2)}%)`;
    const rangeDiff = (
      candles[range.to]?.close - candles[range.from]?.open
    ).toFixed(2);
    const rangeCalc = `${rangeDiff} (${(
      (rangeDiff / candles[candles.length - 1]?.close) *
      100
    ).toFixed(2)}%)`;
    return { candle: candleCalc, range: rangeCalc };
  };

  return (
    <>
      <span className="mt-[40px] absolute z-[999]">
                <span className="pl-[6px] flex gap-[4px]">
                  <span>OHLC</span>
                  {candles &&
                    moveindex !== null &&
                    ["open", "high", "low", "close", "+"].map((i) => (
                      <span key={i}>
                        {i !== "+" ? i.charAt(0).toUpperCase() : ""}
                        <span
                          style={{color:
                              candles[moveindex]?.open <=
                              candles[moveindex]?.close
                                ? chartColors.discord.green
                                : chartColors.discord.red,
                          }}>
                          {i !== "+"
                            ? candles[moveindex]?.[i]?.toFixed(2)
                            : getLegendVals(moveindex).candle}
                        </span>
                      </span>
                    ))}
                </span>
                {
                    candles &&
                    moveindex !== null ? (
                      <>
                    <span
                      style={{
                        color:
                          candles[getVisRange(candles, chartref).from].close <=
                          candles[getVisRange(candles,chartref).to].close
                            ? chartColors.discord.green
                            : chartColors.discord.red,
                      }}
                      className="pl-[6px]">
                      <IconRangeArrows /> {getLegendVals(moveindex).range}
                    </span>
                    <br />
                    <span className="pl-[6px]">
                      Vol
                      <span
                        className="ml-[4px]"
                        style={{
                          color:
                            candles[moveindex]?.open <=
                            candles[moveindex]?.close
                              ? chartColors.discord.green
                              : chartColors.discord.red,
                        }}>
                        {formatVolume(candles[moveindex].volume)}

                      </span>
                    </span>
                    </>
                    ) : (
                      ''
                    )
                  }
                <br />
                {/* START OF INDICATORS IN USE*/}
                {studies.map((obj, i) => (
                  <span
                    onClick={() => {
                      setActiveStudy(i);
                    }}
                    className={`cursor-pointer px-[6px] ${
                      activeStudy === i
                        ? "border border-discord-blurple bg-discord-darkGray bg-opacity-50"
                        : ""
                    } hover:bg-discord-darkGray hover:bg-opacity-50 rounded`}
                  >
                    <span>{obj.name.replace("get", "")}</span>
                    <span className="ml-[4px] text-gray-400">
                      {obj.variables.join(", ")}
                    </span>
                    <span style={{ color: obj.color }} className="ml-[4px]">
                      {moveindex <= obj.data.length - 1 ? (
                        `$${obj.data[moveindex].value.toFixed(2)}`
                      ) : (
                        <IconInifnity />
                      )}
                    </span>
                    {activeStudy === i ? (
                      <span>
                        <span
                          onClick={() => {}}
                          className="ml-[4px] hover:bg-discord-darkGray rounded px-[6px]"
                        >
                          <IconX />
                        </span>
                        <span
                          onClick={() => {}}
                          className=" hover:bg-discord-darkGray rounded px-[6px]"
                        >
                          <IconEye />
                        </span>
                      </span>
                    ) : (
                      <></>
                    )}
                    <br />
                  </span>
                ))}
                {/* END OF INDICATORS IN USE */}
              </span>
    </>
  );
}
