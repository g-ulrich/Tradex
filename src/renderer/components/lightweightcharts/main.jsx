import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, createWatermark, CrosshairMode } from 'lightweight-charts';
import {generateLineData} from '../util';

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

const chartDefaultOptions = {
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


class LightWeight {
  constructor(opt){
    this.options = this.optionsCheck(opt);
    this.ref = this.options?.ref;
    this.chart = createChart(this.ref.body, chartDefaultOptions);
    this.chartStudies = [];
  }

  optionsCheck(opt){
    const options = {};
    for (const key in chartDefaultOptions) {
      if (key in opt) {
        options[key] = opt[key];
      }
    }
    options.ref = opt?.ref;
    return options;
  }

  updateWaterMark(str){
    this.chart.applyOptions({
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
        this.chart.resize(w, h);
        this.options.width = w;
        this.options.height = h;
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
    if (typeof study !== 'undefined' && typeof options !== 'undefined') {
        const type = typeof study?.type !== 'undefined' ? study?.type : 'line';
        const data = typeof study?.data !== 'undefined' ? study?.data : generateLineData(100, 5);

        var seriesType;
        if (type === 'line') {
          var seriesObj = this.chart.addLineSeries(options);
          seriesObj.setData(study?.data);
        } else if (type === 'candle') {
          var seriesObj = this.chart.addCandlestickSeries(options);
          seriesObj.setData(study?.data);
        } else if (type === 'hist') {
          var seriesObj = this.chart.addHistogramSeries(options);
          seriesObj.setData(study?.data);
        }
        const chartStudy = {
          study: study,
          options: options,
          seriesObj: seriesObj,
          id: this.chartStudies.length,
        };
        this.chartStudies.push(chartStudy);
        return chartStudy;
    }
  }

  updateLegend(html){
    this.ref.legend.innerHTML = `<div class="overflow-hidden truncate w-[90%] absolute z-[9999] left-[10px]">${html}</div>`;
  }

  addCrosshairListener(){
    this.chart.subscribeCrosshairMove((obj) => {
        const seriesMap = obj.seriesData;
        /*
        TODO add entry for subsequent charts and other
        non chartOverlay indicators.
        */
        if (seriesMap.size > 0 && this.chartStudies.length > 0) {
          const JsonArr = [];
          var html = '';
          let index = 0;
          seriesMap.forEach((valObj, key) => {
              var study = this.chartStudies[index].study;
              var isCandle = study.type === 'candle';
              var arrow = !isCandle ? '' : valObj.open > valObj.close ? '▼' : '▲';
              var color = !isCandle ? '' : valObj.open < valObj.close ? 'text-green-700' : 'text-red-700';
              var valKeys = Object.keys(valObj);
              var line = '';
              valKeys.forEach((k) => {
                if (k !== 'time' && k !== 'color') {
                  var value = `${study.pre}${valObj[k].toFixed(2)}${study.post}`;
                  line += `${k !== 'value' ? k[0].toUpperCase() : ''}<span class="${color}">${value}</span> `;
                }
              });
              var pl = !isCandle ? '' :
              `<span class="${color}">$${(valObj.close-valObj.open).toFixed(2)} ${arrow} ${(valObj.close/valObj.open).toFixed(2)}%</span>`;
              html += `${study.title} ${line}${pl}@`;
            index += 1;
          });
          this.updateLegend(html.replaceAll('@', '<br/>'))
        }
    });
  }

  kill(){
    if (this.chart != null) {
      this.chart.remove();
    }
  }

}

export default LightWeight;
