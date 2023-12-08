// WatchlistTable.js
import React, { useState, useRef, useEffect } from 'react';
import { orderBy } from 'lodash';
import Pagination from './pagination'; // Adjust the path based on your project structure
import { IconRefresh } from '../Icons';

const WatchlistTable = ({ data, columns, title, searchKey }) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
      const symbol = item[searchKey] || ""; // Handle possible undefined symbol
      return symbol.toLowerCase().includes(searchInput.toLowerCase());
    });

    return filteredData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return (
    <>
      <div className="w-full bg-discord-darkestGray border border-discord-black rounded shadow-lg">
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
                className="block text-discord-white outline-none w-full py-[4px] px-2 ps-10 text-sm border border-none rounded bg-discord-darkerGray"
                placeholder={`${searchKey} Search`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
          </div>
          <a href="#" className="text-sm font-medium text-discord-blurple2">
            <IconRefresh />
          </a>
        </div>
        <div class="overflow-x-auto max-h-[400px] overflow-y-auto bg-discord-darkestGray">
        <table className="w-full divide-y divide-discord-darkerGray">
          <thead className="bg-discord-darkestGray">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-2 py-[4px] text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer"
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
              ))}
            </tr>
          </thead>
          <tbody className="bg-discord-darkestGray divide-y divide-discord-darkerGray">
            {paginateData().map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key} className="px-2 py-[4px] whitespace-nowrap">
                    {column.prefix}{row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <Pagination
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(range) => setItemsPerPage(range)}
        />
      </div>
    </>
  );
};

export default WatchlistTable;
