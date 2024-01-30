import React, { useEffect, useState, useRef } from 'react';
// import TS from '../api/tradestation/main';
import {Accounts} from '../../api/tradestation/accounts';
// import {MarketData} from '../api/tradestation/marketData';
import AccountsList from '../../components/equites/AccountList';
import WatchlistTable from '../../components/tables/watchlistTable';
import { IconPerson, IconCrypto, IconPause, IconPlay } from '../../api/Icons';
import { generateRandomData, strHas, titleBarheight } from '../../tools/util';
import {Chart, AreaSeries} from "lightweight-charts-react-wrapper";
import {data as OHLCV} from '../../components/lightweightcharts/exampleData';
import {csvToJsonArray} from '../../components/lightweightcharts/util';
import FullChart from '../../components/lightweightcharts/fullChart/fullChart';
import {chartColors, defaultSimpleChartOptions} from '../../components/lightweightcharts/options';
import SimpleCardChart from '../../components/lightweightcharts/simpleCardChart';


export default function Equites({accountClass, accountId}) {
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
  const [pause, setPause] = useState(false);
  const [balInterval, setBalInterval] = useState(null);


  useEffect(() => {
    // console.log('dbl success', account.setAccountID())
    account.setAccountID(setAccountId, 'Cash');
    // getQuotes("QQQ,SPY,TQQQ");
    // marketData.streamQuoteChanges('SPY,QQQ');
  }, []);


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
    if (accountId != null) {
      if (pause) {
        console.log("no");
        if (balInterval !== null) {
          clearInterval(balInterval);
        }
      } else {
        const interval = setInterval(() => {
          console.log("go");
          account.setAccountBalances(setAccountBal, accountId, 'Cash');
        }, 1000);
        setBalInterval(interval)
      }
      return () => {
        if (balInterval !== null) {
          clearInterval(balInterval);
        }

      }
    }
  }, [pause]);

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
    </>
  );
}

