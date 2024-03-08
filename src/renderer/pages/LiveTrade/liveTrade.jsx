import React, { useEffect, useState } from 'react';
import CreateAlgo from './snippets';
import {getDateNDaysAgo} from '../../tools/util';
import { IconExpand, IconX } from '../../api/Icons';
import StreamPositionsTable from '../../components/tables/streamPositionsTable';
import WatchlistTable from '../../components/tables/watchlistTable';


document.title = 'Tradex | LiveTrade';

export default function LiveTrade() {
 const [algos, setAlgos] = useState([]);
 const [delId, setDelId] = useState(0);

 // account information
 const [acountsInterval, setAcountsInterval] = useState();
 const [accounts, setAccounts] = useState([]);
 const [positions, setPositions] = useState([]);
 // orders
 const [historicalOrders, setHistoricalOrders] = useState([]);


const newAlgo = () => {
  const algo = algoTemplate();
  setAlgos(prev => [...prev, algo[1]]);
}

const orders = () => {
  var accIds = [];
  [accounts].forEach((obj)=>{
    accIds.push(obj?.AccountID);
  });
  if (accIds.length > 0) {
    window.ts.account.setHistoricalOrders(setHistoricalOrders, accIds.join(','), getDateNDaysAgo(2));
  }
}

useEffect(()=>{
  newAlgo();
  window.ts.account.setAccounts(setAccounts);
    const loop = setInterval(() => {
      if (!accounts) {
        window.ts.account.setAccounts(setAccounts);
      }
    }, 1000);
    setAcountsInterval(loop);
    return () => {
      clearInterval(loop);
    }
},[]);

useEffect(()=>{
  if (accounts) {
    const id = parseInt(Math.random()*1000);
    var accIds = [];
    [accounts].forEach((obj)=>{
      accIds.push(obj?.AccountID);
    });
    window.ts.account.streamPositions(setPositions, id, accIds.join(','), false);
    // window.ts.account.setOrders(setStreamOrders, accIds.join(','))
    orders();
    clearInterval(acountsInterval);
  }
},[accounts]);


// useEffect(()=>{
//   if (historicalOrders.length > 0){
//     setOrders(prev=>[...prev, ...historicalOrders])
//   }
// },[historicalOrders]);

// useEffect(()=>{
//   if (streamOrders.length > 0){
//     setOrders(prev=>[...prev, streamOrders])
//   }
// },[streamOrders]);


 const algoTemplate = () => {
  var id = parseInt(Math.random()*10000);
  return [id, <div
            className="col-4 mx-0 my-2"
            key={id}>
              <div className="rounded border border-discord-black shadow-lg">
                <div className="flex items-center">
                  <div className="flex m-1 text-gray-500 text-sm">Algo ID {algos.length}:{id}</div>
                  <div className="grow">
                    <button
                        onClick={()=>setDelId(prev=>id)}
                        className={`m-1 float-right
                          px-2 py-[3px] rounded text-sm
                          bg-discord-softRed active:bg-discord-softRed`}>
                          <IconX/>
                      </button>
                  </div></div>

                <CreateAlgo/>
              </div>
          </div>];
 }


 useEffect(()=>{
  if (delId) {
    setAlgos(prev =>{
        return prev.filter((obj, i) => {
          if (obj?.key){
            return parseInt(obj?.key) !== parseInt(delId);
          }
        })
      });
  }
 },[delId]);



 return (
    <>
      <div className="container-fluid ">
        <button
          className="shadow mb-2 px-3 rounded text-lg bg-discord-softBlurple active:bg-discord-blurple"
          onClick={newAlgo}>
          Create Instance
        </button>
        <div class="row">
          <div className="col-4 mx-0 my-2">
            <div className="w-full border border-discord-black rounded shadow">
            <StreamPositionsTable
              title={"Positions"}
              data={[positions].length > 0 ? [positions] : []}
              prevData={[]}
              columns={[

                { key: 'Symbol', label: 'Symbol', prefix: '' },
                { key: 'UnrealizedProfitLoss', label: '$PL', prefix: '$' },
                { key: 'UnrealizedProfitLossPercent', label: '%PL', postfix: '%' },
                { key: 'Quantity', label: 'Shares', prefix: '' },
                { key: 'AveragePrice', label: 'Avg$', prefix: '$' },
                { key: 'Last', label: 'Price', prefix: '$' },
                { key: 'MarketValue', label: 'Value', prefix: '$' }
              ]}
              primaryKey={'Symbol'}
            />
            <WatchlistTable
                  title={'Orders'}

                  data={historicalOrders}
                  prevData={[]}
                  columns={[
                    { key: 'Symbol', label: 'Symbol', prefix: '' },
                    { key: 'Status', label: 'Status', prefix: '' },
                    { key: 'BuyOrSell', label: 'Action', prefix: '' },
                    { key: 'ExecutionPrice', label: 'Price', postfix: '' },
                    { key: 'QuantityOrdered', label: 'Shares', postfix: '' },
                    { key: 'OpenedDateTime', label: 'Open', prefix: '' },
                  ]}
                  primaryKey={'Symbol'}
                  />
            </div>
          </div>
          {algos}
        </div>
      </div>
    </>
 );
}

