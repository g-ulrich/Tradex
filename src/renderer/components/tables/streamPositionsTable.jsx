// WatchlistTable.js
import React, { useState, useRef, useEffect } from 'react';
import { orderBy } from 'lodash';
import Pagination from './pagination'; // Adjust the path based on your project structure
import { IconRefresh, IconTriangleDown, IconTriangleUp } from '../../api/Icons';
import {findObjectByVal} from '../../tools/util';
import {
  getMarketOpenStatus
 } from '../lightweightcharts/util';

//  const columns = [
//     { key: 'Symbol', label: 'Symbol', prefix: '' },
//     { key: 'Last', label: 'Price', prefix: '$' },
//     { key: 'NetChange', label: 'DChange', prefix: '$' },
//     { key: 'NetChangePct', label: 'PChange', prefix: '%' },
//     { key: 'Volume', label: 'Volume', prefix: '' },
//     { key: 'Ask', label: 'Ask', prefix: '$' },
//     { key: 'AskSize', label: 'AskSize', prefix: '' },
//     { key: 'Bid', label: 'Bid', prefix: '$' },
//     { key: 'BidSize', label: 'BidSize', prefix: '' },
//   ];


const StreamPositionsTable = ({ data, prevData, columns, title, primaryKey, secondaryKey }) => {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

 useEffect(()=>{
  console.log("data", data);
 },[]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedData = orderBy(data, [sortConfig.key], [sortConfig.direction]);

  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filter data based on search input
    const filteredData = sortedData.filter((item) => {
      const val = item[primaryKey] || ""; // Handle possible undefined symbol
      return val.toLowerCase().includes(searchInput.toLowerCase());
    });

    return filteredData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const isDiff = (row, col) => {
    const prev_row = findObjectByVal(prevData, row[primaryKey], primaryKey);
    if (prev_row != null) {
      return prev_row[col.key] != row[col.key] ? true : false;
    } else {
      return false;
    }
  }

  const handleAction = (txt, row) => {
    if (txt.toLowerCase() === 'buy' || txt.toLowerCase() === 'sell') {
      const status = getMarketOpenStatus();
      const payLoad = window.ts.order._simple(
        row.AccountID,
        status === 'Reg' ? "Market" : "Limit", // ordertype
        row.Quantity,
        row.Symbol,
        status === 'Reg' ? "DAY" : "DYP",
        txt.toUpperCase()
      );
      if (status === 'Reg'){
        window.ts.order.placeOrder(payLoad);
      } else {
        const lp =  txt.toUpperCase() === 'BUY' ? row.Ask : txt.toUpperCase() === 'SELL' ? row.Bid : row.Last;
        window.ts.order.placeOrder({
          ...payLoad,
          LimitPrice: lp.toString(),
        });
      }
    }
  }


  return (
    <>
      <div className=" bg-discord-darkestGray rounded-sm">
        <div className="flex p-2 items-center justify-between">
          <h5 className="text-xl font-bold leading-none text-discord-white">{title}</h5>

          <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
              <input
                type="search"
                className="block text-discord-white outline-none w-full py-[4px] px-2 input-pl text-sm border border-none rounded bg-discord-darkerGray"
                placeholder={`${primaryKey} Search`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[700px] overflow-y-auto bg-discord-darkestGray">
        <table className="w-full divide-y divide-discord-darkerGray">
          <thead className="bg-discord-darkestGray">
            <tr>
            <th className="px-2 py-[4px] text-left text-xs font-medium text-gray-500 tracking-wider ">
                Action
            </th>
            {paginateData().length > 0 ?
                columns.map((column) => (
                  <th
                    key={column.key}
                    className={`
                    ${column.key === primaryKey ? 'sticky left-0 z-[99] shadow-lg shadow-right bg-discord-darkestGray' : ''}
                    px-2 py-[4px] text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer`}
                    onClick={() => requestSort(column.key)}
                  >
                    {column.label}
                    {sortConfig.key === column.key && (
                      <span className={`ml-2 ${sortConfig.direction === 'desc' ? 'inline' : 'hidden'}`}>
                        &#8595;
                      </span>
                    )}
                    {sortConfig.key === column.key && (
                      <span className={`ml-2 ${sortConfig.direction === 'asc' ? 'inline' : 'hidden'}`}>
                        &#8593;
                      </span>
                    )}
                  </th>
                ))
             : (
              <th className="text-center">

              </th>
            )}

            </tr>
          </thead>
          <tbody className="bg-discord-darkestGray divide-y divide-discord-darkerGray">
            {paginateData().length > 0 ?
              paginateData().map((row, index) => (
                <tr key={index}>
                  <td className="flex px-2 py-[4px] whitespace-nowrap">
                    <button
                    onClick={() => {handleAction('buy', {...row, Quantity:
                    `${parseInt(row?.Quantity) >= 5 ? parseInt(parseInt(row?.Quantity) *.2) : row?.Quantity}`
                    })}}
                    className="flex px-1 mr-2 rounded-sm bg-discord-softGreen active:bg-discord-green">
                      B({parseInt(row?.Quantity) >= 5 ? parseInt(parseInt(row?.Quantity) *.2) : row?.Quantity})
                    </button>
                    <button
                    onClick={() => {handleAction('sell', row)}}
                    className="flex px-1 rounded-sm bg-discord-softBlurple active:bg-discord-blurple">
                      S({row?.Quantity})
                    </button>
                  </td>
                  {columns.map((column) => (
                    column.key === primaryKey ? (
                      <td key={column.key}
                        className={`
                        ${!secondaryKey ? 'bg-discord-darkestGray' : row[secondaryKey] >= 0 ? 'bg-discord-darkerGray text-discord-softGreen' : 'bg-discord-darkGray text-discord-softBlurple'}
                        px-2 py-[4px] whitespace-nowrap  sticky left-0 z-[99] shadow-lg shadow-right`}>
                        {
                          !secondaryKey ? '' :
                          row[secondaryKey] >= 0 ?
                            (<span className="mr-2"><IconTriangleUp /></span>):
                            (<span className="mr-2"><IconTriangleDown/></span>)
                        }
                        {row[column.key]}
                      </td>
                    ) : (
                      <td key={column.key}
                      className={`px-2 py-[4px] whitespace-nowrap ${isDiff(row, column) ? 'bg-discord-softBlurple2' : ''}`}>
                        {column.prefix}
                        {column.prefix === '$' || column?.postfix === '%' ?
                          parseFloat(row[column.key]).toFixed(2) :
                          row[column.key]
                        }
                        {column?.postfix ? column?.postfix : ''}
                      </td>
                    )

                  ))}

                </tr>
              ))
             : (
              <tr key={`empty_${title}_header`} className="p-2 text-center text-lg text-gray-500">
                No Data.
              </tr>

            )}
          </tbody>
        </table>
        </div>
        {paginateData().length > 0? (
          <Pagination
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            onItemsPerPageChange={(range) => setItemsPerPage(range)}
          />
        ) : (<></>)}
      </div>
    </>
  );
};

export default StreamPositionsTable;
