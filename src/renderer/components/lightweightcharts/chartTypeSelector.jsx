import React, {useRef} from 'react';
import {
  IconBarChart,
  IconAreaChart,
  IconCandleChart,
  IconLineChart } from '../../api/Icons';

export default function ChartTypeSelector({ chartType, setChartType }){
  const selectChartRef = useRef();

 return (
    <>
    <div className="flex">
      <div className="items-center pr-2 text-lg">
          {chartType === 'bar' ?
            <IconBarChart /> : chartType === 'area' ?
              <IconAreaChart /> : chartType === 'candle' ?
              <IconCandleChart /> : chartType === 'line' ?
              <IconLineChart /> : <IconLineChart />}
        </div>
        <select ref={selectChartRef}
        onChange={()=>{setChartType(selectChartRef.current.value.toLowerCase())}}
        className="outline-none focus:border-none active:border-none text-sm border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
          <option>Candle</option>
          <option>Area</option>
          <option>Bar</option>
          <option>Line</option>
        </select>
    </div>
    </>
 );
};

