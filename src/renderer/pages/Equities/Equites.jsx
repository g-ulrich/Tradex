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
// import {
//   Chart,
//   AreaSeries } from "lightweight-charts-react-wrapper";
import { data as OHLCV } from '../../components/lightweightcharts/exampleData';
import { csvToJsonArray } from '../../components/lightweightcharts/util';
import FullChart from '../../components/lightweightcharts/fullChart/fullChart';
import CandleChart from '../../components/lightweightcharts/candleChart/candleChart';

import SimpleAccountBalanceChart from './simpleAccountBalanceChart';
document.title = 'Tradex | Equities';
// import { ColorType, CrosshairMode } from 'lightweight-charts';

// const chartColors = {
//   white: '#ffffff',
//   softDarkGray: 'rgba(49,53,59, 0.9)',
//   softWhite: 'rgba(100,100,100, 0.4)',
//   softRed: 'rgba(200, 97, 100, .5)',
//   softGreen: 'rgba(39, 157, 130, .5)',
//   discord: {
//     red: '#ED4245',
//     softRed: 'rgba(237,66,69,.5)',
//     green: 'rgb(87,242,135)',
//     softGreen: 'rgba(87,242,135, .5)',
//     white: '#f2f3f5',
//     white2: '#d9dadc',
//     blurple: '#7289DA',
//     blurple2: '#5865f2',
//     softBlurple2: 'rgba(88,101,242,.2)',
//     darkGray: '#424549',
//     darkerGray: '#36393E',
//     darkestGray: '#282B30',
//     black: '#1E2124',
//   }
// }
// const primaryChartOptions = {
//   // width: 500,
//   // height: 400,
//   layout: {
//       textColor: chartColors.white,
//       background: {
//           color: chartColors.discord.darkestGray,
//           type: ColorType.Solid,
//       },
//       fontSize: 12,
//   },
//   rightPriceScale: {
//       scaleMargins: { top: 0.2, bottom: 0.2 },
//   },
//   timeScale: { timeVisible: true, secondsVisible: false },
//   crosshair: {
//       mode: CrosshairMode.FinanceChart,
//       vertLine: {
//           labelBackgroundColor: chartColors.discord.darkerGray,
//       },
//       horzLine: {
//           labelBackgroundColor: chartColors.discord.darkerGray,
//       },
//   },
//   grid: {
//       vertLines: { color: chartColors.softDarkGray },
//       horzLines: { color: chartColors.softDarkGray },
//   },
//   handleScroll: { vertTouchDrag: true },
// };
export default function Equites() {
  const account = window.ts.account;// new Accounts();
  const marketData = window.ts.marketData;
  const [accId, setAccId] = useState(null);
  const [pauseBalArr, setPauseBalArr] = useState(null);
  const [accountBal, setAccountBal] = useState(null);
  const [balArray, setBalArray] = useState([]);
  const [balInterval, setBalInterval] = useState(null);
  const [candles, setCandles] = useState(null);

  useEffect(() => {
    setPauseBalArr(false);
    account.setAccountID(setAccId, 'Cash');
    marketData.setCandles(setCandles, "TQQQ", {
      interval : '5',
      unit : 'Minute',
      barsback : '100'
    });
  }, []);


  // useEffect(() => {
  //   console.log("candles", candles);
  // }, [candles]);

  const dataCallBack = () => {
    return candles;//csvToJsonArray(OHLCV);
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
  {
    candles !== null ? (
      <>
      <CandleChart dataCallBack={dataCallBack}/>

      </>
    ) : (
      <></>
    )
  }
      {/* <FullChart dataCallBack={dataCallBack}/> */}
</div>

{/* <div className="flex gap-2">
  <div className="p-[4px] grow rounded bg-discord-darkestGray h-[400px]">

  </div>
</div> */}
</>
  );
}

