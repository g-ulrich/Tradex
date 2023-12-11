import React, { useEffect, useState } from 'react';
import TS from '../components/tradestation/main';
import AccountsList from '../components/cards/AccountList';
import WatchlistTable from '../components/tables/watchlistTable';
import { IconPerson, IconCrypto } from '../components/Icons';
import { generateRandomData, strHas } from '../components/util';

function Account() {
  const ts = new TS();
  ts.getAccessToken();
  const [data, setData] = useState(generateRandomData());
  const [prevData, setPrevData] = useState([]);

  const [dataColors, setDataColors] = useState();

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
      <div className="max-w-md mb-2">
        <AccountsList title={'Accounts'} itemArr={accountsArr} />
      </div>
      <div className="max-w-md">
        <WatchlistTable data={data} prevData={prevData} columns={columns} title={'Watchlist'} primaryKey={'Symbol'} secondaryKey={'NetChangePct'}/>
      </div>
    </>
  );
}

export default Account;
