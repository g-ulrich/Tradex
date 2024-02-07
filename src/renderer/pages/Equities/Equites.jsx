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
import { csvToJsonArray, getMarketOpenStatus } from '../../components/lightweightcharts/util';
import FullChart from '../../components/lightweightcharts/fullChart/fullChart';
import CandleChart from '../../components/lightweightcharts/candleChart/candleChart';

import SimpleAccountBalanceChart from './simpleAccountBalanceChart';
import WatchlistTable from '../../components/tables/watchlistTable';
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
  const [accId, setAccId] = useState(null);
  const [acc, setAcc] = useState(null);
  const [pauseBalArr, setPauseBalArr] = useState(null);
  const [accountBal, setAccountBal] = useState(null);
  const [prevPositions, setPrevPositions] = useState(null);
  const [positions, setPositions] = useState(null);
  const [balArray, setBalArray] = useState([]);
  const [balInterval, setBalInterval] = useState(null);
  const [newbar, setNewBar] = useState(null);

  useEffect(() => {
    setPauseBalArr(false);
    account.setAccounts(setAcc, 'Cash');
    // account.setAccountID(setAccId, 'Cash'); // accountType is defined, so balance doesnt need to be
  }, []);

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
    // check accountBal if the array is populated
    if (positions !== null) {
        console.log("positions", positions);
      // if (positions.lenth > 0) {
        setPrevPositions(positions);
      // }
    }
  }, [positions]);

  useEffect(() => {
    // check accountBal if the array is populated
    if (accountBal !== null) {
      // create the balance for the simpleChart
      const newbal = {time: Math.floor(new Date()),
                      value: parseFloat(accountBal.Equity)};
      setBalArray(prevData => [...prevData.slice(-100), newbal]);
    }
  }, [accountBal]);

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
                preloadSymbol={'QQQ'}
                accountId={accId}
                options={{
                  interval : '5',
                  unit : 'Minute',
                  barsback : '1000',
                  sessiontemplate : 'USEQ24Hour'
                }}/>
            </div>
            {/* Positions */}
            <div class="col-sm-4 col-md-3 col-xl-2 p-0">
              <div className=" p-2 rounded bg-discord-darkestGray text-gray-500">
                  {

                    true ? (
                      <>
                        <div className="row px-2">
                        <div className="col-6 px-3">
                          <div className="row cursor-pointer bg-discord-blurple hover:bg-discord-softBlurple active:bg-discord-blurple border-2 border-discord-blurple hover:border-discord-softBlurple active:border-discord-blurple text-white rounded">
                            <div className="col-12 px-1 text-left">
                              Sell
                            </div>
                            <div className="col-6 p-1 rounded-r w-full text-left bg-discord-darkestGray">
                              <div className="text-lg">58.00</div>
                              <span className="text-gray-400">Size</span> 1,001
                            </div>
                          </div>
                        </div>
                        <div className="col-6 px-3">
                        <div className="row cursor-pointer bg-discord-green hover:bg-discord-softGreen active:bg-discord-green border-2 border-discord-green hover:border-discord-softGreen active:border-discord-green text-white rounded">
                          <div className="col-12 px-1 text-left">
                            Buy
                          </div>
                          <div className="col-6 p-1 rounded-r w-full text-left bg-discord-darkestGray">
                            <div className="text-lg">58.00</div>
                            <span className="text-gray-400">Size</span> 1,001
                          </div>
                        </div>
                        </div>
                      </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">Loading Data...</div>
                      </>
                    )
                  }
              </div>
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

 {/* {
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
        } */}

    </>
  );
}

