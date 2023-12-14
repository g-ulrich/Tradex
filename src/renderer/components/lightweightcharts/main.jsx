import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';


const chartDefaultOptions = {
  width: 800, // Default width of the chart
  height: 400, // Default height of the chart
  layout: {
    backgroundColor: '#FFFFFF', // Default background color of the chart
    textColor: '#000000', // Default text color of the chart
    fontSize: 12, // Default font size of the chart
  },
  grid: {
    vertLines: {
      color: '#D3D3D3', // Default color of vertical grid lines
    },
    horzLines: {
      color: '#D3D3D3', // Default color of horizontal grid lines
    },
  },
  crosshair: {
    mode: 'normal', // Default crosshair mode
    vertLine: {
      labelBackgroundColor: 'rgb(46, 46, 46)', // Default label background color for vertical crosshair line
    },
    horzLine: {
      labelBackgroundColor: 'rgb(55, 55, 55)', // Default label background color for horizontal crosshair line
    },
  },
  priceScale: {
    position: 'right', // Default position of the price scale
    scaleMargins: {
      top: 0.3, // Default top scale margin for right price scale
      bottom: 0.25, // Default bottom scale margin for right price scale
    },
  },
  timeScale: {
    timeVisible: true, // Default visibility of time scale
    secondsVisible: false, // Default visibility of seconds in time scale
  },
  handleScroll: {
    vertTouchDrag: true, // Default enablement of vertical touch dragging for scrolling
  },
};


class Chart {
  constructor(options){
    this.container = useRef(null);
    this.options = options;
    this.checkProps();
  }

  checkProps(){
    this.options = {
      width: containerRef.clientWidth || 500,
      height: containerRef.clientHeight,
      layout: {
          textColor: colorsObj.color,
          background: {
              color: colorsObj.backgroundColor,
              type: ColorType.Solid,
          },
          fontSize: 12,
      },
      rightPriceScale: {
          scaleMargins: { top: 0.3, bottom: 0.25 },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
      crosshair: {
          mode: CrosshairMode.FinanceChart,
          vertLine: {
              labelBackgroundColor: 'rgb(46, 46, 46)',
          },
          horzLine: {
              labelBackgroundColor: 'rgb(55, 55, 55)',
          },
      },
      grid: {
          vertLines: { color: '#424549' },
          horzLines: { color: '#424549' },
      },
      handleScroll: { vertTouchDrag: true },
  };
  }

  initChart(){
    this.chart = createChart(this.container, this.options);
    return this.chart;
  }

}
