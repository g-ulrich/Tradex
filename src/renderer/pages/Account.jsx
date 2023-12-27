import React, { useEffect, useState, useRef } from 'react';
import TS from '../components/tradestation/main';
import AccountsList from '../components/cards/AccountList';
import NewsList from '../components/cards/NewsList';
import WatchlistTable from '../components/tables/watchlistTable';
import { IconPerson, IconCrypto } from '../components/Icons';
import { generateRandomData, strHas, titleBarheight } from '../components/util';
import {data as OHLCV} from '../components/lightweightcharts/exampleData';
// import FinanceChart from '../components/lightweightcharts/financeChartWidget';

import Chart from '../components/lightweightcharts/chartComponent';
import {csvToJsonArray} from '../components/lightweightcharts/util';

function Account() {
  const [data, setData] = useState(generateRandomData());
  const [prevData, setPrevData] = useState([]);

  const columns = [
    { key: 'Symbol', label: 'Symbol', prefix: '' },
    { key: 'Last', label: 'Price', prefix: '$' },
    { key: 'NetChange', label: 'DChange', prefix: '$' },
    { key: 'NetChangePct', label: 'PChange', prefix: '%' },
    { key: 'Volume', label: 'Volume', prefix: '' },
    { key: 'Ask', label: 'Ask', prefix: '$' },
    { key: 'AskSize', label: 'AskSize', prefix: '' },
    { key: 'Bid', label: 'Bid', prefix: '$' },
    { key: 'BidSize', label: 'BidSize', prefix: '' },
  ];

  const accountsArr = [
    { icon: <IconPerson />, accountName: 'Individual', accountId: '89493849', total: 10000.02, val: -10.01 },
    { icon: <IconCrypto />, accountName: 'Crypto', accountId: '89493849C', total: 1200.00, val: 11.23 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevData(data);
      const newData = generateRandomData();
      setData(newData);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
    <div className="flex gap-2">
      <div className="min-w-[350px] max-w-[400px] sm:w-[50%]">
        <AccountsList title={'Accounts'} itemArr={accountsArr} />
      </div>
      <div className="min-w-[300px] sm:w-[100%]">
        <Chart jsonArray={csvToJsonArray(OHLCV)}/>
      </div>

    </div>


  {/* <div className=" w-[400px] sm:w-full">
    <AccountsList title={'Accounts'} itemArr={accountsArr} />
  </div>
  <div className="bg-gray-200">
    <Chart/>
  </div>
  <div className="w-[400px] sm:w-full">
    <WatchlistTable data={data} prevData={prevData} columns={columns} title={'Watchlist'} primaryKey={'Symbol'} secondaryKey={'NetChangePct'}/>
  </div> */}



      {/* <div className="w-full">
        <NewsList title={'News'} symbols={'AAPL,ASPN'}/>
      </div> */}
    </>
  );
}

export default Account;
