import React, { useState, useEffect } from "react";
import {
  IconInifnity,
  IconRangeArrows,
  IconX,
  IconEye,
  IconClock,
  IconCog,
  IconEyeSlash,
} from "../../../api/Icons";
import {
  chartColors,
} from "../options";
import {
  formatVolume,
  getVisRange,
  getMarketOpenStatus,
} from "../util";
import {
  isSubStr
} from "../../../tools/util";

export default function ChartLegend({symbolName, candles, chartref, moveindex}) {
  const [activeStudy, setActiveStudy] = useState(null);
  const [showOpenStatus, setShowOpenStatus] = useState(false);
  const zIndexVal = '999';

  const marginMult=(n=0)=>{
    const mainMargin=0;
    const spacing=20;
    return mainMargin + spacing * n;
  }

  const getLegendVals = (index) => {
    // legend values for OHLCV
    const candleDiff = (candles[index]?.close - candles[index]?.open).toFixed(2);
    const candleCalc = `${candleDiff} (${((candleDiff / candles[index]?.open) * 100).toFixed(2)}%)`;
    const rangeDiff = (candles[range().to === -1 ? candles.length -1 : range().to]?.close - candles[range().from]?.open).toFixed(2);
    const rangeCalc = `${rangeDiff} (${(
      (rangeDiff / candles[candles.length - 1]?.close) * 100
    ).toFixed(2)}%)`;
    return { candle: candleCalc, range: rangeCalc };
  };

  const range=()=>{
    const {from, to} = getVisRange(candles, chartref);
    return {from: from === -1 ? 0 : from, to: to === -1 ? candles.length - 1 : to};
  }

  return (
    <>
<span className={`absolute mt-[${marginMult()}px] z-[${zIndexVal}] pl-[6px] flex gap-[4px]`}>
        <span>{symbolName}</span>
        <span>
          <button onMouseEnter={() => {setShowOpenStatus(true)}} onMouseLeave={() => {setShowOpenStatus(false)}}
          className={`px-[4px] py-0 rounded-lg text-[13px] ${showOpenStatus ? 'bg-discord-darkGray' : ''} `}>
            <IconClock/> <span className={`${showOpenStatus ? '' : 'hidden'}`}>{getMarketOpenStatus()}</span>
          </button>
        </span>
        {candles &&
          moveindex !== null &&
          ["open", "high", "low", "close", "+"].map((i, index) => (
            <span key={`${index}_${i}`}>
              {i !== "+" ? i.charAt(0).toUpperCase() : ""}
              <span
                style={{color:
                    candles[moveindex]?.open <=
                    candles[moveindex]?.close
                      ? chartColors.discord.green
                      : chartColors.discord.blurple,
                }}>
                {i !== "+"
                  ? candles[moveindex]?.[i]?.toFixed(2)
                  : getLegendVals(moveindex).candle}
              </span>
            </span>
          ))}
      </span>
      {
          candles !== null &&
          moveindex !== null && moveindex >= 0? (
            <>
          <span
            style={{
              margin: `${marginMult(1)}px 0px`,
              color:
                candles[range().from].close <=
                candles[range().to].close
                  ? chartColors.discord.green
                  : chartColors.discord.blurple,
            }}
            className={`pl-[6px] absolute z-[${zIndexVal}]`}>
            <IconRangeArrows /> {getLegendVals(moveindex).range}
          </span>
          <span style={{margin: `${marginMult(2)}px 0px`}} className={`pl-[6px] absolute z-[${zIndexVal}]`}>
            Vol
            <span
              className="ml-[4px]"
              style={{
                color:
                  candles[moveindex]?.open <=
                  candles[moveindex]?.close
                    ? chartColors.discord.green
                    : chartColors.discord.blurple,
              }}>
              {formatVolume(candles[moveindex].volume)}
            </span>
          </span>
          </>

          ) : (
            ''
          )
        }

    </>
  );
}
