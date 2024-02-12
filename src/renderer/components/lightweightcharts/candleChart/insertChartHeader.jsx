import React, { useState, useRef, useEffect } from "react";


import {
  IconFlask,
  IconFlaskVial,
  IconCandleChart,
  IconBarChart,
  IconAreaChart,
  IconLineChart,
  IconSearch,
  IconWallet,
  IconHeart,
  IconHeartPulse,
  IconCog,
  IconClock
} from "../../../api/Icons";

import {
  getMarketOpenStatus
} from "../util";


export default function InsertChartHeader({chartTypeCallback, chartType, searchInput, setSearchInput}){
  const marketType = "Equites";
  const selectChartRef = useRef(null);
  const searchRef = useRef(null);
  const [streaming, setStreaming] = useState("");

  const selectOnChange = () => {
    chartTypeCallback(selectChartRef.current.value.toLowerCase());
  }

  const setSymbol = () => {
    if (searchRef.current !== null) {
      setSearchInput(searchRef.current?.value.toUpperCase());
    }
  }

  useEffect(() => {
    console.log("header searchInput", searchInput);
  }, [searchInput]);


  useEffect(() => {
    const interval = setInterval(() => {
      const streams = window.ts.marketData.allStreams;
      var res = "";
      if (streams.length > 0 && getMarketOpenStatus() !== 'Closed') {
        res = "on";
      } else if (streams.length > 0 && getMarketOpenStatus() === 'Closed') {
        res = "pulse";
      }
      setStreaming(res);
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSymbol();
    }
  };

  return(
    <>

     <div className="flex gap-2 px-2 pb-[4px]">
        <div className="flex">
          <input
            ref={searchRef}
            type="search"
            className="uppercase w-[100px] block text-discord-white outline-none px-2 py-[3px] text-sm border border-none rounded-l bg-discord-darkerGray hover:bg-discord-darkGray"
            placeholder={`${marketType} Search`}
            onKeyPress={handleKeyPress}
          />
          <button onClick={() => setSymbol()} className="px-2 bg-discord-softBlurple hover:bg-discord-blurple active:bg-discord-softBlurple rounded-r">
            <IconSearch />
          </button>

        </div>
        <div className="flex gap-2">
          <div className="flex">
            <div className="items-center pr-2 text-lg">
              {chartType === 'bar' ?
              <IconBarChart /> : chartType === 'area' ?
                <IconAreaChart /> : chartType === 'candle' ?
                <IconCandleChart /> : chartType === 'line' ?
                <IconLineChart /> : <IconLineChart />}
            </div>
            <select ref={selectChartRef} onChange={selectOnChange} className="outline-none focus:border-none active:border-none text-sm border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
              <option>Candle</option>
              <option>Area</option>
              <option>Bar</option>
              <option>Line</option>
            </select>
          </div>


        </div>
        <div className={`grow text-right text-lg`}>
          {
            streaming === 'on' ? (
              <span title="Streaming." className="animate-pulse text-discord-red">
                <IconHeart/>
              </span>
            ) : streaming === 'pulse' ? (
              <span title="Stream Heart Beat." className="animate-pulse text-discord-red">
                 <IconHeartPulse/>
              </span>
            ) : (
              <span title="Not Streaming." className="text-gray-500">
                 <IconHeart/>
              </span>
            )
          }

        </div>
    </div>
    </>
  );
}
