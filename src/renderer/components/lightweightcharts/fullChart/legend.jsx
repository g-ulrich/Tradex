import React, { useState } from "react";
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

export default function ChartLegend({candles, chartref, moveindex, studies, studycallback}) {
  const [activeStudy, setActiveStudy] = useState(null);
  const [showOpenStatus, setShowOpenStatus] = useState(false);
  const [hiddenStudies, setHiddenStudies] = useState([]);
  const zIndexVal = '996';

  const marginMult=(n=0)=>{
    const mainMargin=0;
    const spacing=20;
    return mainMargin + spacing * n;
  }

  const toggleHiddenItem = (index) => {
    setHiddenStudies(prevState => {
      if (prevState.includes(index)) {
        return prevState.filter(item => item !== index);
      } else {
        return [...prevState, index];
      }
    });
  };


  const isHiddenIdExists = (index) => {
    return hiddenStudies.includes(index);
  };

  const getLegendVals = (index) => {
    // legend values for OHLCV
    const range = getVisRange(candles, chartref);
    const candleDiff = (candles[index]?.close - candles[index]?.open).toFixed(2);
    const candleCalc = `${candleDiff} (${((candleDiff / candles[index]?.open) * 100).toFixed(2)}%)`;
    const rangeDiff = (candles[range.to]?.close - candles[range.from]?.open).toFixed(2);
    const rangeCalc = `${rangeDiff} (${(
      (rangeDiff / candles[candles.length - 1]?.close) * 100
    ).toFixed(2)}%)`;
    return { candle: candleCalc, range: rangeCalc };
  };

  const getIndicatorLegendVals = (obj) => {
    const index = moveindex - (candles.length - obj.data.length);
    if (isSubStr(obj.name, "getBollingerBands")) {
      const upper = obj?.data[index]?.upper.toFixed(2);
      const middle = obj?.data[index]?.middle.toFixed(2);
      const lower = obj?.data[index]?.lower.toFixed(2);
      return `$${upper}, $${middle}, $${lower}`;
    } else if (isSubStr(obj.name, "getIchimokucloud")) {
      const conversion = obj?.data[index]?.conversion.toFixed(2);
      const base = obj?.data[index]?.base.toFixed(2);
      const spanA = obj?.data[index]?.spanA.toFixed(2);
      const spanB = obj?.data[index]?.spanB.toFixed(2);
      return `spanA $${spanA} spanB $${spanB}`;
    } else {
      return `$${obj.data[index]?.value.toFixed(2)}`;
    }
  }

  return (
    <>
      <span className={`absolute mt-[${marginMult()}px] z-[${zIndexVal}] pl-[6px] flex gap-[4px]`}>
        <span>OHLC</span>
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
              margin: `${marginMult(1)}px 0px`,
              color:
                candles[getVisRange(candles, chartref).from].close <=
                candles[getVisRange(candles,chartref).to].close
                  ? chartColors.discord.green
                  : chartColors.discord.red,
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
      {/* START OF INDICATORS IN USE*/}
      {studies.map((obj, i) => (
        <span
          onMouseEnter={() => {
            setActiveStudy(i);
          }}
          onMouseLeave={() => {
            setActiveStudy(-1);
          }}
          style={{margin: `${marginMult(3+i)}px 0px`}}
          className={`absolute z-[${zIndexVal}] cursor-pointer px-[6px] ${
            activeStudy === i
              ? "border border-discord-blurple bg-discord-darkGray bg-opacity-50"
              : ""
          } hover:bg-discord-darkGray hover:bg-opacity-50 rounded`}
        >
          <span>{obj.name.replace("get", "")}</span>
          <span className="ml-[4px] text-gray-400">
            {obj.variables.join(", ")}
          </span>
          <span style={{ color: obj.color }} className={`${activeStudy === i ? 'hidden' : ''} ml-[4px]`}>
            {moveindex <= candles.length - 1 && moveindex >= candles.length - obj.data.length? (
              getIndicatorLegendVals(obj)
            ) : (
              <IconInifnity />
            )}
          </span>
          {activeStudy === i ? (
            <span>
              <span
                title="Delete"
                onClick={() => {studycallback('del', obj)}}
                className="ml-[4px] hover:bg-discord-darkGray rounded px-[6px]">
                <IconX />
              </span>
              <span
                title="Visibility"
                onClick={() => {studycallback('vis', obj); toggleHiddenItem(i)}}
                className=" hover:bg-discord-darkGray rounded px-[6px]">
                {isHiddenIdExists(i) ? <IconEyeSlash/> : <IconEye /> }
              </span>
              <span
                title="Settings"
                onClick={() => {studycallback('set', obj)}}
                className="hidden hover:bg-discord-darkGray rounded px-[6px]">
                <IconCog />
              </span>
            </span>
          ) : (
            <></>
          )}
          <br />
        </span>
      ))}
      {/* END OF INDICATORS IN USE */}

    </>
  );
}
