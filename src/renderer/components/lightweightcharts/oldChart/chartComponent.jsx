import React, {useRef, useEffect, useState} from 'react';
// import ta from 'trading-signals';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import LightWeight from './main';
import * as talib from '../talib';
import {convertArrayToJsonArrayForChart, indicatorToLineChart, bollingerbandsToAreaSeriesJsonArr} from '../util';
import {getRandomRGB, isStringInArray, getAllFunctions, generateLineData, generateCandleData,convertCsvToJson ,jsonArrayToArrayByKey, isSubStr} from '../../../tools/util';
import {IconEye, IconEyeSlash, IconFlask, IconAdd} from '../../../api/Icons';
import Slide from '@mui/material/Slide';
import StudiesList from '../studies';


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

    const taResults = talib['getEMA'](jsonArray, 25);
    lwc.newPane();

    // lwc.addChartStudy(
    //   {pre: '$', post: '',type: 'candle', title: 'QQQ', data: jsonArray },
    //   {color: 'rgb(225, 0, 70)', visible: false, pane: 1});
    lwc.addChartStudy({pre: '$', post: '', type: 'line', title: 'EMA (25)', data: indicatorToLineChart(jsonArray, taResults) },
    {color: getRandomRGB(), lineWidth: 2, pane: 1})

    lwc.addChartStudy(
      {pre: '$', post: '',type: 'candle', title: 'TSLA', data: jsonArray },
      {color: 'rgb(225, 0, 70)'});

    lwc.addVolume(jsonArray);

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

  const addStudy = (title, type, RGBcolor, taResults) => {
    LWC.addChartStudy(
      {pre: '$', post: '', type: 'line', title: title, data: indicatorToLineChart(jsonArray, taResults) },
      {color: RGBcolor, lineWidth: 2,});
  }

  const addStudyCallback = (obj, RGBcolor) => {
    console.log(RGBcolor, obj);
    const params = obj.parameters;

    // needs variables
    if (params.length > 1) {
      var variables = [];
      params.forEach((item) => {
        if (item.var !== 'obj') {
          var ele = document.getElementById(`${obj.name}_${item.var}`);
          var val = isSubStr(ele.value, '.') ? parseFloat(ele.value) : parseInt(ele.value);
          variables.push(val);
        }
      });
      const taResults = talib[obj.name](jsonArray, ...variables);
      const title = `${obj.name.replace('get', '')} (${variables.join(",")})`;


      if (isStringInArray(obj.name, talib.mainChart())) {
        if (isSubStr(obj.name.toLowerCase(), 'bands')) { // bollingerbands
          var bb = bollingerbandsToAreaSeriesJsonArr(jsonArray, taResults);
          var upper = bb.map((item) => ({ time: item.time, value: item.upper}));
          var lower = bb.map((item) => ({ time: item.time, value: item.lower}));

          LWC.addChartStudy(
            {pre: '$', post: '', type: 'series', title: 'bb upper', data: upper},
            {color: RGBcolor, topColor: RGBcolor, bottomColor: RGBcolor, lineWidth: 2,});
          LWC.addChartStudy(
            {pre: '$', post: '', type: 'series', title: 'bb lower', data: lower},
            {color: RGBcolor, topColor: RGBcolor, bottomColor: RGBcolor, lineWidth: 2,});
        } else {
          LWC.addChartStudy(
            {pre: '$', post: '', type: 'line', title: title, data: indicatorToLineChart(jsonArray, taResults) },
            {color: RGBcolor, lineWidth: 2,});
        }
      } else if (isStringInArray(obj.name, talib.separateGraph())) {
        console.log('Separate Graph');
      } else {
        console.log('Not on graph');
      }

      // no variables
    }else{
      const taResults = talib[obj.name](jsonArray);
      const title = `${obj.name.replace('get', '')}`;
      if (isStringInArray(obj.name, talib.mainChart())) {
        LWC.addChartStudy(
          {pre: '$', post: '', type: 'line', title: title, data: indicatorToLineChart(jsonArray, taResults) },
          {color: RGBcolor, lineWidth: 2,});
      } else if (isStringInArray(obj.name, talib.separateGraph())) {
        console.log('Separate Graph');
      } else {
        console.log('Not on graph');
      }
    }

  }

  return (
    <>
      <div className="py-2 bg-discord-darkestGray rounded shadow-lg"
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
