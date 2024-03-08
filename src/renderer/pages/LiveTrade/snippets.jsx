import React, { useState, useRef, useEffect } from 'react';
import { IconSpinner, IconX } from '../../api/Icons';
import AccountSelect from './accountSelect';
import FrequencySelect from './frequencySelect';
import StrategySelect from './strategySelect';
import {
  Chart,
  CandlestickSeries
} from "lightweight-charts-react-wrapper";
import {
  getWaterMark,
  crosshairAction,
  getFullSymbolName
} from '../../components/lightweightcharts/util';
import {grpChartOptions,
  chartColors} from '../../components/lightweightcharts/options';
import ResizeChartWidth from '../../components/lightweightcharts/resizeChartWidth';
import HoursSelect from './hoursSelect';



export default function CreateAlgo() {
  const [btnToggle, setBtnToggle] = useState(true);
  const [form, setForm] = useState({});
  // for form
  const symbolRef = useRef();
  const accountRef = useRef();
  const freqRef = useRef();
  const stratRef = useRef();
  const sessionRef = useRef();
  // chart
  const chartRef = useRef();
  const containerRef = useRef();
  const [chartWidth] = ResizeChartWidth(containerRef, 500); // Pass initial width
  const [index, setIndex] = useState(0);
  const [candles, setCandles] = useState([]);
  const [symbolDetails, setSymbolDetails] = useState("");


  useEffect(()=>{
    if (symbolRef.current) {
      symbolRef.current.value = 'TQQQ';
    }
  },[]);


  useEffect(()=>{
    if (btnToggle) {
      symbolRef.current.value = form?.symbol || 'TQQQ';
      setForm(prev=>{});
      setCandles(prev=>[]);
      setSymbolDetails(prev=>"");
      setIndex(prev=>0);
    }else{
      if (form?.account) {
          //  execute code when form starts
      }
    }
  },[btnToggle]);


  const start = () => {
    if (btnToggle){
      const symbol = symbolRef.current.value.toUpperCase();
      const account = JSON.parse(accountRef.current.value);
      const freq = JSON.parse(freqRef.current.value);
      const session = sessionRef.current.value;
      const strategy = stratRef.current.value;
      const options = {
        interval: freq?.interval,
        unit: freq?.unit,
        barsback: 300,
        sessiontemplate: session
      };

      setForm(prev=>{
        return {
          ...prev,
          id: parseInt(Math.random() * 10000),
          account: account,
          symbol: symbol,
          options: options
        }
      });
      window.ts.marketData.setCandles(setCandles, symbol, options);
      window.ts.marketData.setSymbolDetails(setSymbolDetails, symbol);
    }
    setBtnToggle(!btnToggle);
  }


  return (
    <>
    <div>
        <div className="row m-0 gap-2 p-1 overflow-x-auto">
          <div className="col p-0">
            <div className="flex gap-2">

              <button
                onClick={start}
                className={`w-full
                  px-3 py-[3px] rounded text-sm
                  ${btnToggle ? 'flex bg-discord-softGreen active:bg-discord-softGreen' : 'grow animate-pulse bg-discord-softRed active:bg-discord-softRed'}`}>
                {btnToggle ? 'Start' : `Stop ${getFullSymbolName(form?.symbol, symbolDetails)}`}
              </button>
            </div>
          </div>
          {/* Account */}
        <div  className={`${!btnToggle ? 'hidden' : ''} col p-0`}>
        <AccountSelect selectRef={accountRef}/>
        </div>
        {/* Symbol */}
        <div className={`${!btnToggle ? 'hidden' : ''} col p-0`}>
          <input
            ref={symbolRef}
            type="text"
            className={`uppercase block w-full min-w-[62px] text-discord-white outline-none px-2 py-[3px] text-sm border border-none rounded bg-discord-darkerGray hover:bg-discord-darkGray`}
          />
        </div>
        {/* Frequency */}
        <div className={`${!btnToggle ? 'hidden' : ''} col p-0`}>
        <FrequencySelect selectRef={freqRef}/>
        </div>
        {/* Strategy */}
        <div className={`${!btnToggle ? 'hidden' : ''} col p-0`}>
        <StrategySelect selectRef={stratRef}/>
        </div>
        {/* Market Hours */}
        <div className={`${!btnToggle ? 'hidden' : ''} col p-0`}>
        <HoursSelect selectRef={sessionRef}/>
        </div>

        </div>
        <div ref={containerRef} className="mt-2">
          {
            !btnToggle && form?.symbol ?
            (
            <Chart
              watermark={getWaterMark(getFullSymbolName(form?.symbol, symbolDetails), 30)}
              ref={chartRef}
              onCrosshairMove={(e)=>{crosshairAction(setIndex, chartRef, candles, e)}}
              {...grpChartOptions({ width: chartWidth, height: 200, timeVisible: true })}>
                  <InsertCandles candles={candles}/>

            </Chart>
            ) : (<></>)
          }
        </div>
        <div className={`mt-2`}>

        </div>
    </div>
    </>
  );
}


function InsertCandles({candles}){
  return (
    <CandlestickSeries
                    upColor={chartColors.discord.green}
                    downColor={chartColors.discord.blurple}
                    borderDownColor={chartColors.discord.blurple}
                    borderUpColor={chartColors.discord.green}
                    wickDownColor={chartColors.discord.blurple}
                    wickUpColor={chartColors.discord.green}
                    data={candles}
                    // markers={markers}
                    reactive={true} />
  );
}
