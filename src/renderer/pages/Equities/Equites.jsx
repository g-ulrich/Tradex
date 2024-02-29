import React, { useEffect, useState, useRef } from 'react';
import WatchlistTable from '../../components/tables/watchlistTable';
import CandleChart from '../../components/lightweightcharts/candleChartPoll/chart';

document.title = 'Tradex | Equities';

export default function Equites() {
  const [acc, setAcc] = useState(null);
  const [accId, setAccId] = useState(null);
  const watchlistSymbols = "TQQQ,QQQ,SPY,VOO,MSFT,NVDA,AMZN,GOOG,V,XOM,HD,GE,JNJ,GLW";
  const [watchlist, setWatchlist] = useState(null);
  const [symbol, setSymbol] = useState('TQQQ');


  useEffect(() => {

    const interval = setInterval(() => {
        window.ts.account.setAccounts(setAcc, 'Cash');
        window.ts.marketData.setQuoteSnapshots(setWatchlist, watchlistSymbols);
    }, 10000);

    window.ts.account.setAccounts(setAcc, 'Cash');
    window.ts.marketData.setQuoteSnapshots(setWatchlist, watchlistSymbols);
    return () => {
      clearInterval(interval);
    }
  }, []);


  useEffect(() => {
    if (acc != null) {
      setAccId(acc.AccountID);
    }
  }, [acc]);

  const symbolCallback = (text) => {
    setSymbol(prev=>text);
  }

  return (
    <>
     <div className="container-fluid">
      <div className="row">
        <div className="col-3 p-0 bg-discord-softBlurple">
          <div className="p-1">
            {watchlist !== null ? (
                <WatchlistTable
                  title={'Watchlist'}
                  data={watchlist}
                  prevData={[]}
                  columns={[

                    { key: 'Symbol', label: 'Symbol', prefix: '' },
                    { key: 'Last', label: 'Price', prefix: '$' },
                    { key: 'NetChange', label: '$Change', prefix: '$' },
                    { key: 'NetChangePct', label: '%Change', postfix: '%' },
                    { key: 'Volume', label: 'Vol', prefix: '' },
                  ]}
                  primaryKey={'Symbol'}
                  secondaryKey={'NetChange'}
                  />

                ):(<div className="text-center p-2 rounded-sm bg-discord-darkestGray ">
                  Watchlist Loading...
                  </div>)
              }
          </div>

        </div>
        <div className="col-6 p-0 bg-discord-blurple" >
          <div className="p-1">
            <CandleChart
              preloadSymbol={symbol}
              accountId={accId}
              symbolOptions={{
                interval : '5',
                unit : 'Minute',
                barsback : '300',
                sessiontemplate : 'Default'
              }}
              symbolCallback={symbolCallback}/>
          </div>

        </div>
        <div className="col-3 p-0 bg-discord-softBlurple">
          <div className="p-1">

          </div>
        </div>

        </div>
      </div>
    </>
  );
}

