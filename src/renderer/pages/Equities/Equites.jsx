import React, { useEffect, useState, useRef } from 'react';
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
  getDateNDaysAgo,
  currentESTTime } from '../../tools/util';
import { data as OHLCV } from '../../components/lightweightcharts/exampleData';
import { csvToJsonArray,
  getMarketOpenStatus,
  formatVolume } from '../../components/lightweightcharts/util';
import FullChart from '../../components/lightweightcharts/fullChart/fullChart';
import CandleChart from '../../components/lightweightcharts/candleChart/candleChart';

import SimpleAccountBalanceChart from './simpleAccountBalanceChart';
import WatchlistTable from '../../components/tables/watchlistTable';
import OrderForm from './OrderForm';


document.title = 'Tradex | Equities';

const getplStr = (accountBal) =>{
  if (accountBal !== null) {
    const p$ = accountBal.TodaysProfitLoss;
    const b$ = accountBal.Equity;
    return `$${parseFloat(p$).toFixed(3)} ${p$ >= 0 ? '▲' : '▼'} ${(p$/b$*100).toFixed(3)}%`;
  }
  return '';
}

const friendlyMarketStatus = () => {
  var marketStatus = getMarketOpenStatus();
  return`${marketStatus}${marketStatus !== 'Closed' ? '-Market': ''}`;
}


const playDing = () => {
  window.electron.ipcRenderer.sendMessage('playDing', '');
}

export default function Equites() {
  const dingRef = useRef(null);
  const [accId, setAccId] = useState(null);
  const [acc, setAcc] = useState(null);
  const [accountBal, setAccountBal] = useState(null);
  // positions
  const [prevPositions, setPrevPositions] = useState(null);
  const [positions, setPositions] = useState(null);
  // orders
  const [prevOrderHistory, setPrevOrderHistory] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [todaysOrderHistory, setTodaysOrderHistory] = useState([]);

  const [chartCallbackData, setChartCallbackData] = useState(null);
  const preLoadedSymbol = "QQQ"
   // active symbol
  const [activeSymbol, setActiveSymbol] = useState(preLoadedSymbol);


  useEffect(() => {
    playDing();
    window.ts.account.setAccounts(setAcc, 'Cash');
    return () => {
      window.ts.marketData.killAllStreams();
    }
  }, []);


  useEffect(() => {
    if (acc !== null) {
      setAccId(acc.AccountID);
    }
  }, [acc]);

  const onAccIdChange = () =>{
    window.ts.account.setPostions(setPositions, accId);
    window.ts.account.setAccountBalances(setAccountBal, accId, 'Cash');
    window.ts.account.setHistoricalOrders(setOrderHistory, accId, getDateNDaysAgo(7));
    if (activeSymbol !== null) {
      window.ts.account.setOrdersBySymbol(setTodaysOrderHistory, activeSymbol, accId);
    }
  }

  useEffect(() => {
    if (accId != null || accId !== undefined) {
      onAccIdChange();
      document.title = `Tradex | Equites - ${friendlyMarketStatus()}`;
      const interval = setInterval(() => {
          console.log("Streams: MarketDara", window.ts.marketData.allStreams, "Account", window.ts.account.allStreams);
        if (accId != null || accId !== undefined) {
          onAccIdChange();
        }
        document.title = `Tradex | Equites - ${friendlyMarketStatus()}`;
      }, 1000*10);

      return () => {
        clearInterval(interval);
      }
    }
  }, [accId]);


  useEffect(() => {
    if (positions !== null) {
        console.log("positions", positions);
        setPrevPositions(positions);
    }
  }, [positions]);

  useEffect(() => {
    setPrevOrderHistory(orderHistory);
  }, [orderHistory]);

  const symbolCallback = (chartSymbol) => {
    setActiveSymbol(chartSymbol);
  }

  return (
    <>
      <div className="container-fluid">
          <div className="row">

            {/* Header */}
            <div className="col-12 p-1">
              { acc !== null && accountBal !== null ? (
                  <div className={`row p-0 m-0 border border-discord-black items-center py-[4px] bg-discord-darkestGray rounded text-sm ${parseFloat(accountBal.TodaysProfitLoss) >= 0 ? 'text-discord-green' : 'text-discord-blurple'}`}>
                      <div className="col px-[4px]">
                        <div className="bg-discord-softBlurple text-white rounded  py-[0px] text-center text-lg">
                          {getMarketOpenStatus() !== 'Closed' ? `${getMarketOpenStatus()}-` : ''}Market
                          {getMarketOpenStatus() !== 'Closed' ? ' Open' : ' ' + getMarketOpenStatus()}
                        </div>
                      </div>
                      <div className="col text-center">
                        {acc.AccountType} ID #{acc.AccountID}
                      </div>
                      <div className="col text-center">
                        Equity <b>${parseFloat(accountBal.Equity).toFixed(2)}</b>
                      </div>
                      <div className="col text-center">
                        PL <b>{getplStr(accountBal)}</b>
                      </div>
                      <div className="col text-center">
                        Cash <b>${parseFloat(accountBal.CashBalance).toFixed(2)}</b>
                      </div>
                      <div className="col text-center">
                        Market <b>${parseFloat(accountBal.MarketValue).toFixed(2)}</b>
                      </div>
                    </div>
                ) : (<></>)
              }

            </div>
          </div>
          <div className="row">
            {/* Chart */}
            <div class="col-sm-8 col-md-9 col-xl-10 p-1 m-0">
              <CandleChart
                preloadSymbol={preLoadedSymbol}
                accountId={accId}
                symbolOptions={{
                  interval : '5',
                  unit : 'Minute',
                  barsback : '1000',
                  sessiontemplate : 'Default'
                }}
                symbolCallback={symbolCallback}/>
            </div>
            {/* Order */}
            <div class="col-sm-4 col-md-3 col-xl-2 p-1 m-0">
              <OrderForm
                symbol={activeSymbol}
                accountID={accId}
                positions={positions !== null ? positions : []}/>
            </div>
          </div>

          <div className="row">
          <div className="col-sm-6 col-md-6 col-lg-6 col-xxl-3 p-1  m-0">
            {orderHistory !== null ? (
              <WatchlistTable
                title={'Order History'}
                data={orderHistory}
                prevData={[]}
                columns={[
                  { key: 'Symbol', label: 'Symbol', prefix: '' },
                  { key: 'BuyOrSell', label: 'Action', prefix: '' },
                  { key: 'QuantityOrdered', label: 'Shares', prefix: '' },
                  { key: 'OrderType', label: 'Order', prefix: '' },
                  { key: 'FilledPrice', label: 'Price', prefix: '$' },
                  { key: 'Status', label: 'Status', prefix: '' },
                  { key: 'ClosedDateTime', label: 'Closed', prefix: '' },
                ]}
                primaryKey={'Symbol'}

                />

              ):(<>Loading...</>)
            }

            </div>
            <div className="col-sm-6 col-md-6 col-lg-6 col-xxl-3 p-1  m-0">
            {prevPositions ? (
              <WatchlistTable
                title={'Positions'}
                data={positions}
                prevData={prevPositions}
                columns={[
                  { key: 'Symbol', label: 'Symbol', prefix: '' },
                  { key: 'UnrealizedProfitLoss', label: '$PL', prefix: '$' },
                  { key: 'UnrealizedProfitLossPercent', label: '%PL', prefix: '', postfix: '%' },
                  { key: 'Quantity', label: 'Shares', prefix: '' },
                  { key: 'TodaysProfitLoss', label: 'Day $PL', prefix: '$' },
                  { key: 'AveragePrice', label: 'Avg. Price', prefix: '$' },
                  { key: 'Last', label: 'Price', prefix: '$' },
                  { key: 'MarketValue', label: 'Value', prefix: '$' }
                ]}
                primaryKey={'Symbol'}
                secondaryKey={'UnrealizedProfitLoss'}
                />
              ):(<>Loading...</>)
            }
            </div>

          </div>
      </div>

    </>
  );
}

