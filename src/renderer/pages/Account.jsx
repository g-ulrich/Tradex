import React, { useEffect, useState } from 'react';
import TS from '../components/tradestation/main';
import AccountsList from '../components/cards/AccountList';
import NewsList from '../components/cards/NewsList';
import WatchlistTable from '../components/tables/watchlistTable';
import { IconPerson, IconCrypto } from '../components/Icons';
import { generateRandomData, strHas, titleBarheight } from '../components/util';
import FinanceChart from '../components/lightweightcharts/financeChartWidget';

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
      <div className="flex-none max-w-md border-2 border-discord-blurple" >
        <div class="grid grid-cols-1 gap-2">
        <AccountsList title={'Accounts'} itemArr={accountsArr} />
        <WatchlistTable data={data} prevData={prevData} columns={columns} title={'Watchlist'} primaryKey={'Symbol'} secondaryKey={'NetChangePct'}/>
        </div>
      </div>
      <div className="grow border-2 border-discord-blurple">
        <FinanceChart symbol={'QQQ'} height={'500px'} timeFrame={'3M'}/>
      </div>
    </div>

      {/* <div className="w-full">
        <NewsList title={'News'} symbols={'AAPL,ASPN'}/>
      </div> */}
    </>
  );
}

export default Account;
