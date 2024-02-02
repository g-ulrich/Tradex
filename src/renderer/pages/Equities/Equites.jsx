import React, { useEffect, useState } from 'react';
import { Accounts } from '../../api/tradestation/accounts';
import {
  IconPerson,
  IconCrypto,
  IconPause,
  IconPlay
} from '../../api/Icons';
import {Chart, LineSeries, CandlestickSeries, HistogramSeries, PriceScale} from "lightweight-charts-react-wrapper";

import {
  generateRandomData,
  strHas,
  titleBarheight } from '../../tools/util';
import { data as OHLCV } from '../../components/lightweightcharts/exampleData';
import { csvToJsonArray } from '../../components/lightweightcharts/util';
import FullChart from '../../components/lightweightcharts/fullChart/fullChart';
import CandleChart from '../../components/lightweightcharts/candleChart/candleChart';

import SimpleAccountBalanceChart from './simpleAccountBalanceChart';
document.title = 'Tradex | Equities';

export default function Equites() {
  const account = window.ts.account;// new Accounts();

  const [accId, setAccId] = useState(null);
  const [pauseBalArr, setPauseBalArr] = useState(null);
  const [accountBal, setAccountBal] = useState(null);
  const [balArray, setBalArray] = useState([]);
  const [balInterval, setBalInterval] = useState(null);
  const [newbar, setNewBar] = useState(null);


  useEffect(() => {
    setPauseBalArr(false);
    account.setAccountID(setAccId, 'Cash');
  }, []);

  const getplStr =() =>{
    if (accountBal !== null) {
      const p$ = accountBal.TodaysProfitLoss;
      const b$ = accountBal.Equity;
      return `$${p$} ${p$ >= 0 ? '▲' : '▼'} ${(p$/b$*100).toFixed(3)}%`;
    }
    return '';
  }

  useEffect(() => {
    if (accId != null) {
      account.setAccountBalances(setAccountBal, accId, 'Cash');

      const interval = setInterval(() => {
        account.setAccountBalances(setAccountBal, accId, 'Cash');
      }, 1000*30);

      return () => {
          clearInterval(interval);
      }
    }
  }, [accId]);

  useEffect(() => {
    // check accountBal if the array is populated
    if (accountBal !== null) {
      // create the balance for the simpleChart
      const newbal = {time: Math.floor(new Date()), value: parseFloat(accountBal.Equity)};
      setBalArray(prevData => [...prevData.slice(-100), newbal]);
    }
  }, [accountBal]);

  return (
    <>
<div className="flex gap-2">
  <div className="p-[4px] mb-2 grow rounded bg-discord-darkestGray  border border-discord-black">
    {
       accountBal !== null ? (
        <div className="flex gap-2">
          <span className="grow text-lg text-gray-500 rounded text-center">
            <button className={`mr-2 ${pauseBalArr ? 'bg-discord-blurple':'bg-discord-softRed'} rounded px-2`}
              onClick={()=>{setPauseBalArr(!pauseBalArr)}}>
                {pauseBalArr ? <IconPlay/> : <IconPause/>}
            </button>
            #{accId}</span>
          <span className="grow text-lg text-gray-500 rounded text-center">Bal ${accountBal.Equity}</span>
          <span className="grow text-lg text-gray-500 rounded text-center">P/L {getplStr()}</span>
          <span className="grow text-lg text-gray-500 rounded text-center">Pos 10</span>
        </div>
       ) : (<></>)
    }
  </div>
</div>
<div className="mb-2 flex gap-2">
  <div className=" flex min-w-[350px] max-w-[400px] sm:w-[50%] rounded ">
  {
    accountBal !== null ? (
      <SimpleAccountBalanceChart
        accountClass={account}
        accountId={accId}
        pause={pauseBalArr}
        setPause={setPauseBalArr}
        accountBal={accountBal}
        seriesData={balArray}
        />
      ) : (<></>)
  }
    {/* <WatchlistTable/> */}
  </div>
      <CandleChart symbol={'TQQQ'}
      options={{
        interval : '5',
        unit : 'Minute',
        barsback : '100',
        sessiontemplate : 'USEQ24Hour'
      }}/>

      {/* <FullChart dataCallBack={dataCallBack}/> */}
</div>

{/* <div className="flex gap-2">
  <div className="p-[4px] grow rounded bg-discord-darkestGray h-[400px]">

  </div>
</div> */}
</>
  );
}

