import React, { useEffect, useState } from 'react';
import { Accounts } from '../../api/tradestation/accounts';
import {
  IconPerson,
  IconCrypto,
  IconPause,
  IconPlay
} from '../../api/Icons';
import {
  generateRandomData,
  strHas,
  titleBarheight } from '../../tools/util';
import {
  Chart,
  AreaSeries } from "lightweight-charts-react-wrapper";
import { data as OHLCV } from '../../components/lightweightcharts/exampleData';
import { csvToJsonArray } from '../../components/lightweightcharts/util';
import FullChart from '../../components/lightweightcharts/fullChart/fullChart';
import SimpleAccountBalanceChart from './simpleAccountBalanceChart';


export default function Equites() {
  const account = new Accounts();
  const [accountId, setAccountId] = useState(null);
  const [pause, setPause] = useState(false);
  const [accountBal, setAccountBal] = useState(null);
  const [balArray, setBalArray] = useState([]);
  const [balInterval, setBalInterval] = useState(null);

  useEffect(() => {
    // console.log('dbl success', account.setAccountID())
    account.setAccountID(setAccountId, 'Cash');
    // getQuotes("QQQ,SPY,TQQQ");
    // marketData.streamQuoteChanges('SPY,QQQ');
  }, []);

  const dataCallBack = () => {
    return csvToJsonArray(OHLCV);
  }

  const getplStr =() =>{
    if (accountBal !== null) {
      const p$ = accountBal.TodaysProfitLoss;
      const b$ = accountBal.Equity;
      return `$${p$} ${p$ >= 0 ? '▲' : '▼'} ${(p$/b$*100).toFixed(3)}%`;
    }
    return '';
  }

  useEffect(() => {
    if (accountId != null) {
      account.setAccountBalances(setAccountBal, accountId, 'Cash');
    }
  }, [accountId]);

  useEffect(() => {
    // check accountBal if the array is populated
    if (accountBal !== null) {
      // create the balance for the simpleChart
      const newbal = {time: Math.floor(new Date()), value: parseFloat(accountBal.Equity)};
      setBalArray(prevData => [...prevData.slice(-100), newbal]);
    }
  }, [accountBal]);

  useEffect(() => {
    console.log("okay");
    if (accountId != null) {
      if (pause) {
        if (balInterval !== null) {
          clearInterval(balInterval);
        }
      } else {
        const interval = setInterval(() => {
          account.setAccountBalances(setAccountBal, accountId, 'Cash');
        }, 5000);
        setBalInterval(interval)
      }
      return () => {
        if (balInterval !== null) {
          clearInterval(balInterval);
        }

      }
    }
  }, [pause]);

  return (
    <>
<div className="flex gap-2">
  <div className="p-[4px] mb-2 grow rounded bg-discord-darkestGray">
    {
       accountBal !== null ? (
        <div className="flex gap-2">
          <span className="flex text-lg">
            <button className={`mr-2 ${pause ? 'bg-discord-blurple':'bg-discord-softRed'} rounded px-2`} onClick={()=>{setPause(!pause)}}>{pause ? <IconPlay/> : <IconPause/>}</button>
            Equities #{accountId}</span>
          <span className="grow text-lg text-gray-500 rounded text-center">Bal ${accountBal.Equity}</span>
          <span className="grow text-lg text-gray-500 rounded text-center">P/L {getplStr()}</span>
          <span className="grow text-lg text-gray-500 rounded text-center">Pos 10</span>
        </div>
       ) : (<></>)
    }


  </div>
</div>
    <div className="flex gap-2">

    <div className=" mb-2 flex min-w-[350px] max-w-[400px] sm:w-[50%] rounded">
    {
       accountBal !== null ? (
      <SimpleAccountBalanceChart
        accountClass={account}
        accountId={accountId}
        pause={pause}
        setPause={setPause}
        accountBal={accountBal}
        seriesData={balArray}
        />
        ) : (<></>)
    }
      {/* <WatchlistTable/> */}
    </div>
        {/* <FullChart dataCallBack={dataCallBack}/> */}

    </div>

    </>
  );
}

