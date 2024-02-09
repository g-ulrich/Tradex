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

export default function Equites() {
  const account = window.ts.account;// new Accounts();
  const marketData = window.ts.marketData;// new MarketData();
  const [accId, setAccId] = useState(null);
  const [acc, setAcc] = useState(null);
  const [accountBal, setAccountBal] = useState(null);
  const [prevPositions, setPrevPositions] = useState(null);
  const [positions, setPositions] = useState(null);
  const [chartCallbackData, setChartCallbackData] = useState(null);
  const [quotes, setQuotes] = useState(null);
  const preLoadedSymbol = "QQQ"
   // active symbol
  const [activeSymbol, setActiveSymbol] = useState(preLoadedSymbol);
  const [activeSymbolQuote, setActiveSymbolQuote] = useState(null);
  const [activeSymbolDetails, setActiveSymbolDetails] = useState(null);

  useEffect(() => {
    account.setAccounts(setAcc, 'Cash');
    marketData.setQuoteSnapshots(setQuotes, activeSymbol)
  }, []);

  useEffect(() => {
    marketData.setQuoteSnapshots(setQuotes, activeSymbol)
    marketData.setSymbolDetails(setActiveSymbolDetails, activeSymbol);
  }, [activeSymbol]);

  useEffect(() => {
    if (quotes !== null) {
      quotes.forEach((q)=>{
        if (q.Symbol === activeSymbol){
          setActiveSymbolQuote(q);
        }
      });
    } else {
      marketData.setQuoteSnapshots(setQuotes, activeSymbol)
    }
  }, [quotes]);

  useEffect(() => {
    if (acc !== null) {
      setAccId(acc.AccountID);
    }
  }, [acc]);

  useEffect(() => {
    if (accId != null || accId !== undefined) {
      account.setPostions(setPositions, accId);
      account.setAccountBalances(setAccountBal, accId, 'Cash');

      document.title = `Tradex | Equites - ${friendlyMarketStatus()}`;
      const interval = setInterval(() => {
        if (accId != null || accId !== undefined) {
          account.setPostions(setPositions, accId);
          account.setAccountBalances(setAccountBal, accId, 'Cash');
        }
        document.title = `Tradex | Equites - ${friendlyMarketStatus()}`;
      }, 1000*30);

      return () => {
        clearInterval(interval);
      }
    }
  }, [accId]);

  useEffect(() => {
    if (positions !== null) {
        setPrevPositions(positions);
    }
  }, [positions]);

  const symbolCallback = (chartSymbol) => {
    if (preLoadedSymbol !== chartSymbol) {
      if (chartSymbol !== "" || typeof chartSymbol !== 'undefined' || chartSymbol !== null) {
        setActiveSymbol(chartSymbol);
      }
    }
  }

  return (
    <>
      <div className="container-fluid">
          <div className="row">
            {/* Header */}
            <div className="col-12 mb-2">
              { acc !== null && accountBal !== null ? (
                  <div className={`row items-center py-[4px] bg-discord-darkestGray rounded text-sm ${parseFloat(accountBal.TodaysProfitLoss) >= 0 ? 'text-discord-green' : 'text-discord-blurple'}`}>
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
            {/* Chart */}
            <div class="col-sm-8 col-md-9 col-xl-10 pr-2 pl-0">
              <CandleChart
                preloadSymbol={preLoadedSymbol}
                accountId={accId}
                options={{
                  interval : '5',
                  unit : 'Minute',
                  barsback : '1000',
                  sessiontemplate : 'USEQ24Hour'
                }}
                symbolCallback={symbolCallback}/>
            </div>
            {/* Order */}
            <div class="col-sm-4 col-md-3 col-xl-2 p-0">
              <OrderForm quote={activeSymbolQuote} details={activeSymbolDetails !== null ? activeSymbolDetails[0] : activeSymbolDetails}/>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-4 col-xxl-3 p-0 mt-2">
            {prevPositions ? (
              <WatchlistTable
                title={'Positions'}
                data={positions}
                prevData={prevPositions}
                columns={[
                  { key: 'Symbol', label: 'Symbol', prefix: '' },
                  { key: 'TodaysProfitLoss', label: '$PL', prefix: '$' },
                  { key: 'Quantity', label: 'Shares', prefix: '' },
                  { key: 'AveragePrice', label: 'Avg. Price', prefix: '$' },
                  { key: 'Last', label: 'Price', prefix: '$' },
                  { key: 'MarketValue', label: 'Value', prefix: '$' }
                ]}
                primaryKey={'Symbol'}
                />
              ):(<>Loading...</>)
            }

            </div>
            <div className="col-6">

            </div>
          </div>
      </div>

    </>
  );
}

