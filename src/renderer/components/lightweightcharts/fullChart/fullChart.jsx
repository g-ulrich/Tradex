import React, { useEffect, useState, useRef } from "react";
import * as talib from "../talib";
import { ColorType, CrosshairMode } from "lightweight-charts";
import ChartLegend from './legend';
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
import { data as OHLCV } from "../exampleData";
import {
  defaultChartOptions,
  chartColors,
  seriesColors,
  CHART_THEMES,
} from "../options";
import {
  convertArrayToJsonArrayForChart,
  indicatorToLineChart,
  bollingerbandsToLineSeriesJsonArr,
  ichimokucToAreaLineJsonArr,
  csvToJsonArray,
  candleToLineChart,
  formatVolume,
  getVisRange,
} from "../util";
import { isStringInArray, isSubStr, getAllFunctions, getRandomRGB, findObjectById } from "../../util";
import {
  IconFlask,
  IconFlaskVial,
  IconCandleChart,
  IconBarChart,
  IconAreaChart,
  IconLineChart,
  IconSearch,
  IconWallet,
} from "../../Icons";
import {StudiesList} from "../studies";

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

  const addStudyCallback = (obj, RGBcolor, inputValues) => {
    obj.id = `${obj.name}_${chartStudies.length}`;
    obj.color = RGBcolor; // update color from the rgbcolor val
    obj.variables = obj.parameters
    .filter((p) => p.var !== "obj")
    .map((p) =>{
    var n = document.getElementById(`${obj.name}_${p.var}`).value;
    return isSubStr(n, '.') ? parseFloat(n) : parseInt(n);}
    );
    obj.hidden = false;
    if (isSubStr(obj.name, 'getBollingerBands')) {
      obj.data = bollingerbandsToLineSeriesJsonArr(candles,
        talib[obj.name](candles, ...obj.variables));
    } else if (isSubStr(obj.name, 'getIchimokucloud')) {
      obj.data = ichimokucToAreaLineJsonArr(candles,
        talib[obj.name](candles, ...obj.variables));
    } else {
      obj.data = indicatorToLineChart(
        candles,
        talib[obj.name](candles, ...obj.variables)
      );
    }
    setChartStudies((prevChartStudies) => [...prevChartStudies, obj]);
  };

  const toggleStudies = () => {
    setShowStudy(!showStudy);
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

  const studyCallbackFunc = (action, studyObj) => {
    if (action === 'vis') {
      const updatedStudies = chartStudies.map(study => {
        if (study.id === studyObj.id) {
          return { ...study, hidden: !study.hidden };
        }
        return study;
      });
      setChartStudies(updatedStudies);
    } else if (action === 'del') {
      const updatedStudies = chartStudies.filter(study => study.id !== studyObj.id);
      setChartStudies(updatedStudies);
    } else if (action === 'set') {
      // TODO make settings popup
    }
  }




  return (
    <>

      <div ref={containerRef} className="grow relative min-w-[300px] sm:w-[100%]">

        <div className="w-full h-[610px] bg-discord-darkestGray rounded py-2">
        <StudiesList
            showStudy={showStudy}
            addStudyCallback={addStudyCallback}
            toggleStudies={toggleStudies}
          />
        {candles !== null && containerRef !== null ? (
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
            <ChartLegend candles={candles}
                  moveindex={crosshairIndex}
                  chartref={primaryChartRef}
                  studies={chartStudies}
                  studycallback={studyCallbackFunc}/>
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
                  setChartType("bar");
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
                  setChartType("candle");
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
                  setChartType("line");
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
                  setChartType("area");
                }}
              >
                <IconAreaChart /> <span className="hidden xl:inline-block">Area</span>
              </button>

              <span>
              <button
                className={`${
                  showStudy ? "text-discord-blurple" : "text-discord-white"
                } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
                onClick={toggleStudies}
              >
                {showStudy ? <IconFlaskVial /> : <IconFlask />} <span className="hidden lg:inline-block">Indicators</span>

              </button>

                </span>
            </div>

          </div>


            <Chart
              ref={primaryChartRef}
              onCrosshairMove={(e) => {
                setCrosshairIndex(
                  candles.findIndex(obj => obj.time === e.time || obj.time === candles[candles.length-1].time)
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
                    candles[getVisRange(candles,primaryChartRef).from].close <=
                    candles[getVisRange(candles,primaryChartRef).to].close
                      ? seriesColors.green.line
                      : seriesColors.red.line
                  }
                  lineWidth={2}
                />
              ) : chartType === "area" ? (
                <AreaSeries
                  data={candleToLineChart(candles, "close")}
                  topColor={
                    candles[getVisRange(candles,primaryChartRef).from].close <=
                    candles[getVisRange(candles,primaryChartRef).to].close
                      ? seriesColors.green.top
                      : seriesColors.red.top
                  }
                  bottomColor={
                    candles[getVisRange(candles,primaryChartRef).from].close <=
                    candles[getVisRange(candles,primaryChartRef).to].close
                      ? seriesColors.green.bottom
                      : seriesColors.red.bottom
                  }
                  lineColor={
                    candles[getVisRange(candles,primaryChartRef).from].close <=
                    candles[getVisRange(candles,primaryChartRef).to].close
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
                  obj?.hidden ? (
                    <></>
                  ) : typeof obj?.data[0]?.value !== 'number' ? (

                    isSubStr(obj?.name, 'getBollingerBands') ? (
                      <>
                      { candles &&
                        ["upper", "middle", "lower"].map((keyName) => (
                          <LineSeries
                            key={`${i}_keyName`}
                            lineWidth={keyName === 'middle' ? 1 : 1.5}
                            color={obj.color}
                            data={
                              obj?.data.map((item) => ({ time: item.time, value: item[keyName]}))
                            }
                            lineStyle={keyName === 'middle' ? CHART_THEMES.dottedLine.lineStyle : CHART_THEMES.nothingLine.lineStyle}
                          />
                        ))
                      }
                      </>
                    ) : isSubStr(obj?.name, 'getIchimokucloud') ? (
                      <>
                        {/* "conversion", "base", "spanA", "spanB"*/}
                        { candles &&
                          ["spanA", "spanB"].map((keyName) => (
                            <LineSeries
                              key={`${i}_${keyName}`}
                              lineWidth={1.5}
                              color={obj.color}
                              data={
                                obj?.data.map((item) => ({ time: item.time, value: item[keyName]}))
                              }
                            />
                          ))
                        }
                      </>
                    ) : (
                      ''
                    )
                  ) : (
                    <LineSeries
                      key={i}
                      lineWidth={1}
                      color={obj.color}
                      data={obj.data}
                    />
                  )
                ))}
            </Chart>
            </>
          ) : (
            <span className="text-center">Loading...</span>
          )}
        </div>
      </div>
    </>
  );
}
