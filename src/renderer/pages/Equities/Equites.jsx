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
  titleBarheight,
  getDateNDaysAgo } from '../../tools/util';
import { data as OHLCV } from '../../components/lightweightcharts/exampleData';
import { csvToJsonArray, getMarketOpenStatus } from '../../components/lightweightcharts/util';
import FullChart from '../../components/lightweightcharts/fullChart/fullChart';
import CandleChart from '../../components/lightweightcharts/candleChart/candleChart';

import SimpleAccountBalanceChart from './simpleAccountBalanceChart';
document.title = 'Tradex | Equities';

export default function Equites() {
  const account = window.ts.account;// new Accounts();
  const [accId, setAccId] = useState(null);
  const [pauseBalArr, setPauseBalArr] = useState(null);
  const [accountBal, setAccountBal] = useState(null);
  const [positions, setPositions] = useState(null);
  const [balArray, setBalArray] = useState([]);
  const [balInterval, setBalInterval] = useState(null);
  const [newbar, setNewBar] = useState(null);
  const [orderHistory, setOrderHistory] = useState(null);

  useEffect(() => {
    setPauseBalArr(false);
    account.setAccountID(setAccId, 'Cash'); // accountType is defined, so balance doesnt need to be
  }, []);

  const getplStr =() =>{
    if (accountBal !== null) {
      const p$ = accountBal.TodaysProfitLoss;
      const b$ = accountBal.Equity;
      return `$${p$} ${p$ >= 0 ? '▲' : '▼'} ${(p$/b$*100).toFixed(3)}%`;
    }
    return '';
  }

  const friendlyMarketStatus = () => {
    var marketStatus = getMarketOpenStatus();
    return`${marketStatus}${marketStatus !== 'Closed' ? '-Market Open': ''}`;
  }

  useEffect(() => {
    if (accId != null || accId !== undefined) {
      account.setPostions(setPositions, accId, 'TQQQ')
      account.setAccountBalances(setAccountBal, accId, 'Cash');
      // account.setHistoricalOrdersBySymbol(setOrderHistory, 'TQQQ', accId, getDateNDaysAgo(1));
      account.setOrdersBySymbol(setOrderHistory, "TQQQ", accId);

      document.title = `Tradex | Equites - ${friendlyMarketStatus()}`;
      const interval = setInterval(() => {
        account.setOrdersBySymbol(setOrderHistory, "TQQQ", accId);
          account.setAccountBalances(setAccountBal, accId, 'Cash');
          document.title = `Tradex | Equites - ${friendlyMarketStatus()}`;
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
       accountBal !== null && positions !== null ? (
        <div className="flex gap-2">
           <span
            className={`${getMarketOpenStatus() !== 'Closed' ? 'bg-discord-softBlurple' : 'bg-discord-darkerGray'} grow text-lg text-white rounded text-center`}>
            {friendlyMarketStatus()}</span>
          <span
            className="grow text-lg text-gray-500 rounded text-center">
            #{accId}</span>
          <span className="grow text-lg text-gray-500 rounded text-center">Bal ${accountBal.Equity}</span>
          <span className="grow text-lg text-gray-500 rounded text-center">P/L {getplStr()}</span>
          <span className="grow text-lg text-gray-500 rounded text-center">Pos {positions?.length}</span>
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
        barsback : '1000',
        sessiontemplate : 'USEQ24Hour'
      }}
      orderHistory={orderHistory}
      />

      {/* <FullChart dataCallBack={dataCallBack}/> */}
</div>

{/* <div className="flex gap-2">
  <div className="p-[4px] grow rounded bg-discord-darkestGray h-[400px]">

  </div>
</div> */}
</>
  );
}

