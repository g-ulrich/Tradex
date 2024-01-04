import React, { useEffect, useState, useRef } from "react";
import * as talib from "./talib";
import { ColorType, CrosshairMode } from "lightweight-charts";

import {
  Chart,
  LineSeries,
  BarSeries,
  PriceLine,
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  PriceScale,
} from "lightweight-charts-react-wrapper";
import { data as OHLCV } from "./exampleData";
import {
  defaultChartOptions,
  chartColors,
  seriesColors,
  CHART_THEMES,
} from "./options";
import {
  convertArrayToJsonArrayForChart,
  indicatorToLineChart,
  bollingerbandsToAreaSeriesJsonArr,
  csvToJsonArray,
  candleToLineChart,
} from "./util";
import { getAllFunctions, getRandomRGB } from "../util";
import {
  IconFlask,
  IconFlaskVial,
  IconCandleChart,
  IconBarChart,
  IconAreaChart,
  IconLineChart,
  IconInifnity,
  IconSearch,
  IconRangeArrows,
  IconX,
  IconEye,
} from "../Icons";
import StudiesList from "./studies";

export default function FullChart({ dataCallBack }) {
  const marketType = "Equites";
  const containerRef = useRef(null);
  const primaryChartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [candles, setCandles] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [showStudy, setShowStudy] = useState(false);
  const [crosshairIndex, setCrosshairIndex] = useState(0);
  const [chartStudies, setChartStudies] = useState([]);
  const [chartType, setChartType] = useState("area"); // bar, candle, line, area
  const [activeStudy, setActiveStudy] = useState(null);

  useEffect(() => {
    setCandles(dataCallBack());

    const resizeWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth);
      }
    };
    resizeWidth();
    window.addEventListener("resize", resizeWidth);
    return () => {
      window.removeEventListener("resize", resizeWidth);
    };
  }, []);

  const addStudyCallback = (obj, RGBcolor) => {
    obj.color = RGBcolor; // update color from the rgbcolor val
    obj.variables = obj.parameters
      .filter((parameter) => parameter.var !== "obj")
      .map((parameter) => parseInt(parameter.val));
    obj.data = indicatorToLineChart(
      candles,
      talib[obj.name](candles, ...obj.variables)
    );
    setChartStudies((prevChartStudies) => [...prevChartStudies, obj]);
  };

  const toggleStudies = () => {
    setShowStudy(!showStudy);
  };

  const getVisRange = () => {
    if (primaryChartRef.current !== null) {
      const chartRange = primaryChartRef.current.timeScale().getVisibleRange();
      const fromIndex = candles.findIndex(
        (item) => item["time"] === chartRange.from
      );
      const toIndex = candles.findIndex(
        (item) => item["time"] === chartRange.to
      );
      return { from: fromIndex, to: toIndex };
    }
    return { from: 0, to: 1 };
  };

  const crosshairAction = (e) => {
    if (primaryChartRef.current !== null) {
      const chartRange = primaryChartRef.current.timeScale().getVisibleRange();
      const fromIndex = candles.findIndex(
        (item) => item["time"] === chartRange.from
      );
      const toIndex = candles.findIndex(
        (item) => item["time"] === chartRange.to
      );
      console.log(fromIndex, toIndex, e.logical);
      // setChartVals({logical: e.logical, range: {from: fromIndex, to: toIndex}});
    }
  };

  const getLegendVals = (index) => {
    // legend values for OHLCV
    const range = getVisRange();
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
      <div ref={containerRef} className="grow min-w-[300px] sm:w-[100%]">
        <div className="w-full h-[610px] bg-discord-darkestGray rounded py-2">
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
              <span className="mt-[40px] absolute z-[999]">
                <span className="pl-[6px] flex gap-[4px]">
                  <span>OHLC</span>
                  {candles &&
                    crosshairIndex !== null &&
                    ["open", "high", "low", "close", "+"].map((i) => (
                      <span key={i}>
                        {i !== "+" ? i.charAt(0).toUpperCase() : ""}
                        <span
                          style={{
                            color:
                              candles[crosshairIndex]?.open <=
                              candles[crosshairIndex]?.close
                                ? chartColors.discord.green
                                : chartColors.discord.red,
                          }}
                        >
                          {i !== "+"
                            ? candles[crosshairIndex]?.[i]?.toFixed(2)
                            : getLegendVals(crosshairIndex).candle}
                        </span>
                      </span>
                    ))}
                </span>
                <span
                  style={{
                    color:
                      candles[getVisRange().from].close <=
                      candles[getVisRange().to].close
                        ? chartColors.discord.green
                        : chartColors.discord.red,
                  }}
                  className="pl-[6px]"
                >
                  <IconRangeArrows /> {getLegendVals(crosshairIndex).range}
                </span>
                <br />

                <span className="pl-[6px]">
                  Vol
                  <span
                    className="ml-[4px]"
                    style={{
                      color:
                        candles[crosshairIndex]?.open <=
                        candles[crosshairIndex]?.close
                          ? chartColors.discord.green
                          : chartColors.discord.red,
                    }}
                  >
                    {candles[crosshairIndex].volume}
                  </span>
                </span>
                <br />
                {/* START OF INDICATORS IN USE*/}
                {chartStudies.map((obj, i) => (
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
                      {crosshairIndex <= obj.data.length - 1 ? (
                        `$${obj.data[crosshairIndex].value.toFixed(2)}`
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
            </div>
            <div className="flex gap-2">
              <button className="rounded bg-discord-blurple2 hover:bg-discord-blurple px-2 py-[3px]">
                Order
              </button>
              <button
                className={`${
                  chartType === "bar"
                    ? "text-discord-blurple"
                    : "text-discord-white"
                } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                onClick={() => {
                  setChartType("bar");
                }}
              >
                <IconBarChart /> Bar
              </button>
              <button
                className={`${
                  chartType === "candle"
                    ? "text-discord-blurple"
                    : "text-discord-white"
                } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                onClick={() => {
                  setChartType("candle");
                }}
              >
                <IconCandleChart /> Candle
              </button>
              <button
                className={`${
                  chartType === "line"
                    ? "text-discord-blurple"
                    : "text-discord-white"
                } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                onClick={() => {
                  setChartType("line");
                }}
              >
                <IconLineChart /> Line
              </button>
              <button
                className={`${
                  chartType === "area"
                    ? "text-discord-blurple"
                    : "text-discord-white"
                } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                onClick={() => {
                  setChartType("area");
                }}
              >
                <IconAreaChart /> Area
              </button>

              <button
                className={`${
                  showStudy ? "text-discord-blurple" : "text-discord-white"
                } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                onClick={toggleStudies}
              >
                {showStudy ? <IconFlaskVial /> : <IconFlask />} Indicators
                <StudiesList
                  showStudy={showStudy}
                  addStudyCallback={addStudyCallback}
                  toggleStudies={toggleStudies}
                />
              </button>
            </div>
          </div>

          {candles !== null && containerRef !== null ? (
            <Chart
              ref={primaryChartRef}
              onCrosshairMove={(e) => {
                setCrosshairIndex(
                  e.logical >= 0 && e.logical <= candles.length - 1
                    ? e.logical
                    : candles.length - 1
                );
              }}
              {...defaultChartOptions({ width: chartWidth, height: 600 })}
            >
              {/* START VOLUME */}
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
              {/* END VOLUME  */}

              {chartType === "line" ? (
                <LineSeries
                  data={candleToLineChart(candles, "close")}
                  color={
                    candles[getVisRange().from].close <=
                    candles[getVisRange().to].close
                      ? seriesColors.green.line
                      : seriesColors.red.line
                  }
                  lineWidth={2}
                />
              ) : chartType === "area" ? (
                <AreaSeries
                  data={candleToLineChart(candles, "close")}
                  topColor={
                    candles[getVisRange().from].close <=
                    candles[getVisRange().to].close
                      ? seriesColors.green.top
                      : seriesColors.red.top
                  }
                  bottomColor={
                    candles[getVisRange().from].close <=
                    candles[getVisRange().to].close
                      ? seriesColors.green.bottom
                      : seriesColors.red.bottom
                  }
                  lineColor={
                    candles[getVisRange().from].close <=
                    candles[getVisRange().to].close
                      ? seriesColors.green.line
                      : seriesColors.red.line
                  }
                  lineWidth={0.5}
                />
              ) : chartType === "bar" ? (
                <BarSeries
                  data={candles}
                  thinBars={false}
                  downColor={chartColors.discord.red}
                  upColor={chartColors.discord.green}
                ></BarSeries>
              ) : (
                <CandlestickSeries data={candles} />
              )}

              {chartStudies.map((obj, i) => (
                <LineSeries
                  key={i}
                  lineWidth={1}
                  color={obj.color}
                  data={obj.data}
                />
              ))}
            </Chart>
          ) : (
            <span className="text-center">Loading...</span>
          )}
        </div>
      </div>
    </>
  );
}
