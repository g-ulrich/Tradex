import React, {useRef, useEffect, useState} from 'react';
// import ta from 'trading-signals';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import LightWeight from '../lightweightcharts/main';
import * as talib from '../lightweightcharts/talib';
// import {Classifications} from '../lightweightcharts/talib';
import {convertArrayToJsonArrayForChart, indicatorToLineChart} from '../lightweightcharts/util';
import {isStringInArray, getAllFunctions, generateLineData, generateCandleData,convertCsvToJson ,jsonArrayToArrayByKey, isSubStr} from '../util';
import {IconEye, IconEyeSlash, IconFlask, IconAdd} from '../Icons';
import Slide from '@mui/material/Slide';
import StudiesList from './studies';


function Chart({jsonArray}) {
  const containerRef = useRef(null);
  const chartHeaderRef = useRef(null);
  const chartLegendRef = useRef(null);
  const chartBodyRef = useRef(null);
  const chartFooterRef = useRef(null);
  const [showStudy, setShowStudy] = useState(false);
  const [talibFuncs, setTalibFuncs] = useState(getAllFunctions(talib));
  const [LWC, setLWC] = useState(null);


  useEffect(() => {
    const chartHeight = 500;
    const lwc = new LightWeight({
      ref: {container: containerRef.current,
            header: chartHeaderRef.current,
            legend: chartLegendRef.current,
            body: chartBodyRef.current,
            footer: chartFooterRef.current,},
      width: containerRef.current.clientWidth,
      height: chartHeight
    });

    lwc.addChartStudy(
      {pre: '$', post: '',type: 'candle', title: 'OHLC', data: jsonArray },
      {color: 'rgb(225, 0, 70)'});

    lwc.addVolume(jsonArray);

    // const emas = [5, 10, 25, 50];
    // for (let n of emas) {
    //   var emaArray = talib.getEMA(jsonArray, n);
    //   lwc.addChartStudy(
    //     {pre: '$', post: '', type: 'line', title: `EMA (${n})`, data: indicatorToLineChart(jsonArray, emaArray) },
    //     {color: `rgb(${225 - n}, ${n}, ${25+n})`, lineWidth: 2,});
    // }


    lwc.chartResize(containerRef.current.clientWidth, chartHeight);

    lwc.addCrosshairListener();

    const listenerResize = () => {lwc.chartResize(containerRef.current.clientWidth, chartHeight)}
    window.addEventListener('resize', listenerResize);
    setLWC(lwc);
    return () => {
      window.removeEventListener('resize', listenerResize);
      lwc.kill();
    };
  }, []);


  const toggleStudies =() => {
    setShowStudy(!showStudy);
  }

  const addStudy = (title, taResults) => {
    LWC.addChartStudy(
      {pre: '$', post: '', type: 'line', title: title, data: indicatorToLineChart(jsonArray, taResults) },
      {color: `rgb(225, 0, 25)`, lineWidth: 2,});
  }

  const addStudyCallback = (obj) => {
    const params = obj.parameters;
    if (params.length > 1) {
      var variables = [];
      params.forEach((item) => {
        if (item.var !== 'obj') {
          var ele = document.getElementById(`${obj.name}_${item.var}`);
          var val = isSubStr(ele.value, '.') ? parseFloat(ele.value) : parseInt(ele.value);
          // console.log(obj.name, item.var + '=' + val );
          variables.push(val);
        }
      });
      const taResults = talib[obj.name](jsonArray, ...variables);
      const title = `${obj.name.replace('get', '')} (${variables.join(",")})`;
      if (isStringInArray(obj.name, talib.Classifications.mainChart)) {
        addStudy(title, taResults);
      } else if (isStringInArray(obj.name, talib.Classifications.separateGraph)) {
        console.log('Separate Graph');
      } else {
        console.log('Not on graph');
      }

    }else{
      const taResults = talib[obj.name](jsonArray);
      const title = `${obj.name.replace('get', '')}`;
      if (isStringInArray(obj.name, talib.Classifications.mainChart)) {
        addStudy(title, taResults);
      } else if (isStringInArray(obj.name, talib.Classifications.separateGraph)) {
        console.log('Separate Graph');
      } else {
        console.log('Not on graph');
      }
    }

  }

  return (
    <>
      <div className="py-2 bg-discord-darkestGray border border-discord-black rounded shadow-lg"
        ref={containerRef}>
        <div ref={chartHeaderRef} className="mx-2 pb-2 border-b border-discord-black">
          <button className={`border-b-2 border-[${showStudy ? 'discord-white' : 'rgba(0,0,0,0.0)'}] hover:border-discord-blurple hover:text-discord-blurple px-2 py-[4px]`} onClick={toggleStudies}><IconFlask/></button>
        </div>
        <div className="relative" ref={chartLegendRef}></div>
        <div className="relative" ref={chartBodyRef}>
            <StudiesList showStudy={showStudy}
                        talibFuncs={talibFuncs}
                        addStudyCallback={addStudyCallback}
                        toggleStudies={toggleStudies}/>
        </div>
        <div ref={chartFooterRef}></div>
      </div>
    </>
  );
};

export default Chart;
