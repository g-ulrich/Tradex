import React, { useState } from "react";

import {
  IconFlask,
  IconFlaskVial,
  IconCandleChart,
  IconBarChart,
  IconAreaChart,
  IconLineChart,
  IconSearch,
  IconWallet,
} from "../../../api/Icons";


export default function InsertChartHeader({toggleStudiesFunc, chartTypeCallback, chartType, showStudy}){
  const marketType = "Equites";
  const [searchInput, setSearchInput] = useState("");

  return(
    <>
     <div className="flex mx-2 pb-2 gap-2 items-center border-b border-discord-darkGray">
            <div className="flex">
              <div className="absolute flex items-center ps-2 pt-[6px] pointer-events-none">
                <IconSearch />
              </div>
              <input
                type="search"
                className="block ps-8 text-discord-white outline-none  py-[4px] px-2 text-sm border border-none rounded bg-discord-darkerGray hover:bg-discord-darkGray"
                placeholder={`${marketType} Search`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
                <button className="rounded bg-discord-blurple2 hover:bg-discord-blurple px-2 py-[3px]">
                  <IconWallet/> <span className="hidden lg:inline-block">Order</span>
                </button>
                  <button
                    className={`${
                      chartType === "bar"
                        ? "text-discord-blurple"
                        : "text-discord-white"
                    } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                    onClick={() => {
                      chartTypeCallback("bar");
                    }}
                  >
                    <IconBarChart /> <span className="hidden xl:inline-block">Bar</span>
                  </button>
                  <button
                    className={`${
                      chartType === "candle"
                        ? "text-discord-blurple"
                        : "text-discord-white"
                    } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                    onClick={() => {
                      chartTypeCallback("candle");
                    }}
                  >
                    <IconCandleChart /> <span className="hidden xl:inline-block">Candle</span>
                  </button>
                  <button
                    className={`${
                      chartType === "line"
                        ? "text-discord-blurple"
                        : "text-discord-white"
                    } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                    onClick={() => {
                      chartTypeCallback("line");
                    }}
                  >
                    <IconLineChart /> <span className="hidden xl:inline-block">Line</span>
                  </button>
                  <button
                    className={`${
                      chartType === "area"
                        ? "text-discord-blurple"
                        : "text-discord-white"
                    } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                    onClick={() => {
                      chartTypeCallback("area");
                    }}
                  >
                    <IconAreaChart /> <span className="hidden xl:inline-block">Area</span>
                  </button>
                <span>
                <button
                  className={`${
                    showStudy ? "text-discord-blurple" : "text-discord-white"
                  } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                  onClick={toggleStudiesFunc}
                >
                  {showStudy ? <IconFlaskVial /> : <IconFlask />} <span className="hidden lg:inline-block">Indicators</span>

                </button>
                </span>
            </div>
          </div>
    </>
  );
}
