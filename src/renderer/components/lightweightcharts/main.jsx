import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, createWatermark, CrosshairMode, LineStyle, Cre } from 'lightweight-charts';
import {generateLineData, isSubStr} from '../util';
import { IconEye } from '../Icons';

const chartColors = {
  white: '#ffffff',
  softDarkGray: 'rgba(49,53,59, 0.9)',
  softWhite: 'rgba(100,100,100, 0.4)',
  softRed: 'rgba(200, 97, 100, .5)',
  softGreen: 'rgba(39, 157, 130, .5)',
  discord: {
    red: '#ED4245',
    softRed: 'rgba(237,66,69,.5)',
    green: 'rgb(87,242,135)',
    softGreen: 'rgba(87,242,135, .5)',
    white: '#f2f3f5',
    white2: '#d9dadc',
    blurple: '#7289DA',
    blurple2: '#5865f2',
    softBlurple2: 'rgba(88,101,242,.2)',
    darkGray: '#424549',
    darkerGray: '#36393E',
    darkestGray: '#282B30',
    black: '#1E2124',
  }
}

const primaryChartOptions = {
  width: 500,
  height: 400,
  layout: {
      textColor: chartColors.white,
      background: {
          color: chartColors.discord.darkestGray,
          type: ColorType.Solid,
      },
      fontSize: 12,
  },
  rightPriceScale: {
      scaleMargins: { top: 0.2, bottom: 0.2 },
  },
  timeScale: { timeVisible: true, secondsVisible: false },
  crosshair: {
      mode: CrosshairMode.FinanceChart,
      vertLine: {
          labelBackgroundColor: chartColors.discord.darkerGray,
      },
      horzLine: {
          labelBackgroundColor: chartColors.discord.darkerGray,
      },
  },
  grid: {
      vertLines: { color: chartColors.softDarkGray },
      horzLines: { color: chartColors.softDarkGray },
  },
  handleScroll: { vertTouchDrag: true },
};

const secondaryChartOptions = {
  width: 500,
  height: 200,
  layout: {
      textColor: chartColors.white,
      background: {
          color: chartColors.discord.darkestGray,
          type: ColorType.Solid,
      },
      fontSize: 12,
  },
  rightPriceScale: {
      scaleMargins: { top: 0.2, bottom: 0.2 },
  },
  timeScale: { timeVisible: true, secondsVisible: false },
  crosshair: {
      mode: CrosshairMode.FinanceChart,
      vertLine: {
          labelBackgroundColor: chartColors.discord.darkerGray,
      },
      horzLine: {
          labelBackgroundColor: chartColors.discord.darkerGray,
      },
  },
  grid: {
      vertLines: { color: chartColors.softDarkGray },
      horzLines: { color: chartColors.softDarkGray },
  },
  handleScroll: { vertTouchDrag: true },
};

class LightWeight {
  constructor(opt){
    this.options = this.optionsCheck(opt);
    this.ref = this.options?.ref;
    this.chartStudies = [];
    this.panes = [createChart(this.ref.body, primaryChartOptions)];
    this.lastCrosshairSeries = null;
    this.crosshairSubs = [];
  }

  optionsCheck(opt){
    const options = {};
    for (const key in primaryChartOptions) {
      if (key in opt) {
        options[key] = opt[key];
      }
    }
    options.ref = opt?.ref;
    return options;
  }

  startSubToRangeChange(){
    this.panes[0].timeScale().subscribeVisibleLogicalRangeChange(range => {
      this.panes.forEach((pane, i) => {
        if (i > 0) { // exclude the first pane
          pane.timeScale().setVisibleLogicalRange(range);
        }
      });
    });

    this.panes.forEach((pane, i)=> {
      if (i > 0) {// exclude first pane
        pane.timeScale().subscribeVisibleLogicalRangeChange(range => {
          this.panes[0].timeScale().setVisibleLogicalRange(range);
        });
      }
    });
  }

  newPane(){
    this.panes.push(createChart(this.ref.body, secondaryChartOptions));

    for (let i = 0; i<this.panes.length-1;i++) { // exclude the last pane
      this.panes[i].applyOptions({
        timeScale: {
          visible: false,
        },
      });
    }
    this.startSubToRangeChange();
  }

  updateWaterMark(str, pane=0){
    this.panes[pane].applyOptions({
      watermark: {
        color: chartColors.softWhite,
        visible: true,
        text: str,
        fontSize: 40
      }
    });
  }

  chartResize(w, h){
    try {
      if (typeof w !== 'undefined' || typeof h !== 'undefined') {
        this.panes.forEach((pane, i) => {
          pane.resize(w, i > 0 ? secondaryChartOptions.height : primaryChartOptions.height);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  addVolume(jsonArray){
    if (typeof jsonArray[0]?.volume !== 'undefined') {

        const volumeData = jsonArray.map((candle) => ({
          time: candle.time,
          value: candle.volume,
          color: candle.open > candle.close ? chartColors.softRed : chartColors.softGreen,
        }));

        const chartStudy = this.addChartStudy({pre: '', post: '', type: 'hist', title: 'Vol', data: volumeData},
                  {priceFormat: { type: 'volume' }, overlay: true, priceScaleId: 'volume_scale'});
        chartStudy.seriesObj.priceScale().applyOptions({
          scaleMargins: { top: 0.8, bottom: 0 },
        });
    }
  }

  addChartStudy(study, options){
    var pane = typeof options?.pane !== 'undefined' ? options?.pane : 0;
    if (typeof study !== 'undefined' && typeof options !== 'undefined') {
        const type = typeof study?.type !== 'undefined' ? study?.type : 'line';
        const data = typeof study?.data !== 'undefined' ? study?.data : generateLineData(100, 5);

        var seriesType;
        if (type === 'line') {
          var seriesObj = this.panes[pane].addLineSeries(options);
          seriesObj.setData(study?.data);
        } else if (type === 'candle') {
          var seriesObj = this.panes[pane].addCandlestickSeries(options);
          seriesObj.setData(study?.data);
        } else if (type === 'hist') {
          var seriesObj = this.panes[pane].addHistogramSeries(options);
          seriesObj.setData(study?.data);
        } else if (type === 'series') {
          var seriesObj = this.panes[pane].addAreaSeries(options);
          // if (isSubStr(study?.title.toLowerCase(), 'bb')) {
            var bb = study?.data;
            console.log(bb);
            seriesObj.setData(
              bb
              // bb.map((item) => ({ time: item.time, value: item.middle })),
              // bb.map((item) => ({ time: item.time, value: item.lower }))
            );
            // seriesObj.setData(bb.map((item) => ({ time: item.time, value: item.middle })));
            // seriesObj.setData(bb.map((item) => ({ time: item.time, value: item.lower })));
          // } else {
          //   seriesObj.setData(study?.data);
          // }
        }
        const chartStudy = {
          pane: pane,
          study: study,
          options: options,
          seriesObj: seriesObj,
          id: this.chartStudies.length,
        };
        this.chartStudies.push(chartStudy);
        return chartStudy;
    }
  }


  updateLegend(currentPaneIndex, deleteBtnIdsArray, toggleViewIdsArray, html){
    this.ref.legend.innerHTML = html;
    const self = this;
    // Remove Series Btns
    try {
      deleteBtnIdsArray.forEach((id) => {
        var btn = document.getElementById(id);
        if (!isSubStr(id, '-1')) {
          btn.addEventListener("click", function() {
            const studyId = id.split("_")[1];
            const study = self.chartStudies[studyId];
            self.chart.removeSeries(study.seriesObj);
            self.chartStudies.splice(studyId, 1);
            if (self.lastCrosshairSeries != null) {
              self.lastCrosshairSeries.splice(studyId, 1);
              self.processCrosshairMoveForLegend(self.lastCrosshairSeries, currentPaneIndex);
            }
          });
        }
      });
    } catch (error) {console.error(`${error}`);}

    // Toggle View Series Btns
    try {
      toggleViewIdsArray.forEach((id) => {
        var btn = document.getElementById(id);
        btn.addEventListener("click", function() {
          const studyId = id.split("_")[1];
          const study = self.chartStudies[studyId];
          const isVisible = self.isSeriesVisbile(study.seriesObj);
          if (isVisible) {
            self.hideSeries(study.seriesObj);
          } else {
            self.showSeries(study.seriesObj);
          }
          if (self.lastCrosshairSeries != null) {
            self.processCrosshairMoveForLegend(self.lastCrosshairSeries, currentPaneIndex);
          }
        });
      });
    } catch (error) {}
  }

  getCandleInfo(incomingObj, indexedStudy){
    var isCandle = indexedStudy.type === 'candle';
    var arrow = !isCandle ? '' : incomingObj.open > incomingObj.close ? '▼' : '▲';
    var color = !isCandle ? '' : incomingObj.open < incomingObj.close ? 'text-green-700' : 'text-red-700';
    return {isCandle: isCandle, arrow: arrow, color: color,
      pl: !isCandle ? '' :
      `<span class="${color}">$${(incomingObj.close-incomingObj.open).toFixed(2)} ${arrow} ${(incomingObj.close/incomingObj.open).toFixed(2)}%</span>`};
  }

  // syncCrosshair(series, dataPoint) {
  //   if (dataPoint) {
  //     chart.setCrosshairPosition(dataPoint.value, dataPoint.time, series);
  //     return;
  //   }
  //   chart.clearCrosshairPosition();
  // }
  syncCrosshair(xAxisVal, currentPaneIndex){
    this.panes.forEach((pane, i)=>{
      if (currentPaneIndex !== i) {
        pane.setCrosshairPosition(undefined, xAxisVal, this.chartStudies[currentPaneIndex].seriesObj);

        // pane.createPriceLine({
        //   time: xAxisVal,
        //   color: 'rgba(255, 0, 0, 0.5)', // The color of the line
        //   lineWidth: 1, // The width of the line
        //   lineStyle: LineStyle.Dotted, // The style of the line
        // });
      }
      // pane.clearCrosshairPosition();
    });
  }

  processCrosshairMoveForLegend(seriesArray, currentPaneIndex){
    if (seriesArray.length > 0 && this.chartStudies.length > 0) {
      // const firstMapItem = seriesArray[0];
      // this.syncCrosshair(firstMapItem.time, currentPaneIndex);
      const JsonArr = [];
      const deleteBtnIds = [];
      const toggleViewIds = [];
      var html = '';
      seriesArray.forEach((valObj, index) => {
          var chartStudy = this.chartStudies[index];
          var study = chartStudy.study;
          var info = this.getCandleInfo(valObj, study);
          var valKeys = Object.keys(valObj);
          var line = '';
          valKeys.forEach((k) => {
            if (k !== 'time' && k !== 'color') {
              var value = `${study.pre}${valObj[k].toFixed(2)}${study.post}`;
              line += `${k !== 'value' ? k[0].toUpperCase() : ''}<span class="${info.color}">${value}</span> `;
            }
          });
          const ignoreCandle = !info.isCandle && typeof chartStudy.options?.color !== 'undefined' ? true : false;
          const isVisible = this.isSeriesVisbile(chartStudy.seriesObj);
          deleteBtnIds.push(ignoreCandle ? `deleteBtn_${index}` : `deleteBtn_-1`);
          toggleViewIds.push(`viewBtn_${index}`);
          const deleteBtn = ignoreCandle ? `<button title="Remove" class="cursor-pointer rounded bg-discord-red hover:bg-red-700 w-[20px] px-[4px] mr-[2px] my-[2px] " id="deleteBtn_${index}">×</button>` : '';
          const toggleViewCss = `${isVisible ? 'bg-discord-darkGray bg-opacity-50 rounded hover:bg-opacity-100' : 'bg-discord-blurple hover:bg-discord-blurple2'}`;
          const toggleViewbtn = `<button title="Toggle View" class="cursor-pointer rounded ${toggleViewCss} w-[20px] px-[4px] mr-[2px] my-[2px]" id="viewBtn_${index}">Ø</button>`;
          const lineColor = ignoreCandle ? `<b><span style="color:${chartStudy.options?.color}">—</span></b>` : '';
          html += `${deleteBtn} ${toggleViewbtn} <span class="bg-discord-darkGray bg-opacity-50 rounded px-[4px]"> ${lineColor} ${study.title} ${line}${info.pl}</span></br>`;
        });
      // if (currentPaneIndex > 0 && (isSubStr(html, '▼') || isSubStr(html, '▲')) ) {
        // testing for invisible candle chart on additional panes.
      // } else {
        const legend = `<div class="overflow-hidden text-gray-300 truncate w-[90%] absolute z-[9999] left-[10px]">${html}</div>`;
        this.updateLegend(currentPaneIndex, deleteBtnIds, toggleViewIds, legend);
      // }
    }
  }

  addCrosshairListener(){
    this.panes.forEach((pane, i)=> {
        pane.subscribeCrosshairMove((obj) => {
          const seriesMap = obj.seriesData;
          const seriesArray = Array.from(seriesMap.values());
          this.lastCrosshairSeries = seriesArray;
          /*
          TODO add entry for subsequent charts and other
          non chartOverlay indicators.
          */
        this.processCrosshairMoveForLegend(seriesArray, i);
      });
    // this.crosshairSubs.push({obj: crosshair, pane: pane});
    });
  }

  getDataByIndex(index){
    const series = this.chartStudies[index];
    return series.seriesObj.data();
  }

  seriesClicked(i){
    console.log(i);
  }

  isSeriesVisbile(series){
    return series.options().visible;
  }

  hideSeries(series){
    series.applyOptions({
      visible: false,
    });
  }

  showSeries(series){
    series.applyOptions({
      visible: true,
    });
  }

  kill(){
    if (this.panes[0] != null) {
      window.removeEventListener('resize', this.listenerResize);
      this.crosshairSubs.forEach((json, i)=>{
        json.pane.unsubscribeCrosshairMove(json.obj);
      });
      this.panes.forEach((pane)=>{
        pane.remove();
      });
    }
  }

}

export default LightWeight;
