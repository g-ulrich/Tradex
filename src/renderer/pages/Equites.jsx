import React, { useEffect, useState, useRef } from 'react';
// import TS from '../api/tradestation/main';
import {Accounts} from '../api/tradestation/accounts';
// import {MarketData} from '../api/tradestation/marketData';
import AccountsList from '../components/equites/AccountList';
import WatchlistTable from '../components/tables/watchlistTable';
import { IconPerson, IconCrypto, IconPause, IconPlay } from '../components/Icons';
import { generateRandomData, strHas, titleBarheight } from '../components/util';
import {Chart, AreaSeries} from "lightweight-charts-react-wrapper";
import {data as OHLCV} from '../components/lightweightcharts/exampleData';
import {csvToJsonArray} from '../components/lightweightcharts/util';
import FullChart from '../components/lightweightcharts/fullChart/fullChart';
import {chartColors, defaultSimpleChartOptions} from '../components/lightweightcharts/options';
import SimpleCardChart from '../components/lightweightcharts/simpleCardChart';


export default function Equites() {
  // tradestation init
  // const ts = new TS();
  // const token_id = ts.getAccessToken();
  const account = new Accounts();
  // const marketData = new MarketData(token_id);
  // react
  const detailsContainerRef = useRef(null);
  const [accountDetailsWidth, setAccountDetailsWidth] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [accountBal, setAccountBal] = useState(null);
  const [balArray, setBalArray] = useState([]);
  const [quotes, setQuotes] = useState([]);


  // const [pause, setPause] = useState(false);


  useEffect(() => {
    // console.log('dbl success', account.setAccountID())
    account.setAccountID(setAccountId, 'Cash');
    // getQuotes("QQQ,SPY,TQQQ");
    // marketData.streamQuoteChanges('SPY,QQQ');
  }, []);


  useEffect(() => {
    if (accountId != null) {
      account.setAccountBalances(setAccountBal, accountId, 'Cash');
      const interval = setInterval(() => {
        account.setAccountBalances(setAccountBal, accountId, 'Cash');
      }, 5000);
      return () => {
        clearInterval(interval);
      }
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
  return (
    <>
<div className="flex gap-2">
  <div className="p-[4px] mb-2 grow rounded bg-discord-darkestGray">
    {
       accountBal !== null ? (
        <div className="flex gap-2">
          <span className="flex text-lg">
            {/* <button className={`mr-2 ${pause ? 'bg-discord-blurple':'bg-discord-softRed'} rounded px-2`} onClick={()=>{setPause(!pause)}}>{pause ? <IconPlay/> : <IconPause/>}</button> */}
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
            <>
            <SimpleCardChart
            title={`#${accountId}`}
            watermarkText={`$${parseFloat(accountBal.Equity).toFixed(2)}`}
            seriesData={balArray}/>
            </>
          ) : (
            <>
            Loading...
            </>
          )
        }
      {/* <WatchlistTable/> */}
    </div>
        {/* <FullChart dataCallBack={dataCallBack}/> */}

    </div>

    </>
  );
}

