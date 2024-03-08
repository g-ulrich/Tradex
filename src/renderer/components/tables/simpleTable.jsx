// WatchlistTable.js
import React, { useState, useRef, useEffect } from 'react';
import { orderBy } from 'lodash';
import Pagination from './pagination'; // Adjust the path based on your project structure
import { IconRefresh, IconTriangleDown, IconTriangleUp } from '../../api/Icons';
import {findObjectByVal} from '../../tools/util';

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

export default function SimpleTable({ data, prevData, columns, primaryKey, secondaryKey }){

  return (
    <>
      <div className=" bg-discord-darkestGray rounded-sm">
        <div className="overflow-x-auto max-h-[700px] overflow-y-auto bg-discord-darkestGray">
        <table className="w-full divide-y divide-discord-darkerGray">
          <thead className="bg-discord-darkestGray">
            <tr>
              {data.length > 0 ?
                  columns.map((column) => (
                    <th
                      key={column.key}
                      className={`
                      ${column.key === primaryKey ? 'sticky left-0 z-[99] shadow-lg shadow-right bg-discord-darkestGray' : ''}
                      px-2 py-[4px] text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer`}>
                      {column.label}
                    </th>
                  )) : (<th></th>)}
            </tr>
          </thead>
          <tbody className="bg-discord-darkestGray divide-y divide-discord-darkerGray">
            {data.length > 0 ?
              data.map((row, index) => (
                <tr key={index}>
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
                      className={`px-2 py-[4px] whitespace-nowrap`}>
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
              <></>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
};


