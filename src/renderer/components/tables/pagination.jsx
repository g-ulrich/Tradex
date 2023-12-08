// Pagination.js
import React from 'react';
import { IconEllipsis, IconAnglesL, IconAnglesR, IconAngleR, IconAngleL } from '../Icons';

const Pagination = ({ totalItems, itemsPerPage, currentPage, totalPages, onPageChange, onItemsPerPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((page) => page + 1);
  const itemsRemain = totalItems % itemsPerPage;
  // var totalItemsOnPage = currentPage === totalPages ? (totalItems % itemsPerPage) : itemsPerPage;
  const totalItemsOnPage = totalItems % itemsPerPage === 0 ? itemsPerPage : currentPage === totalPages ? (totalItems % itemsPerPage) : itemsPerPage;
  const to = (currentPage*itemsPerPage)-itemsPerPage+1;
  const from = currentPage === totalPages ? totalItems : totalItemsOnPage*currentPage;

  return (
      <div className="flex my-[4px] mx-2">
        <div className="text-gray-500 mr-2">Size:</div>
        <div className="mr-2">
        <select onChange={(e) => onItemsPerPageChange(e.target.value)} className="cursor-pointer text-dsicord-white bg-discord-darkerGray rounded outline-none block w-full px-2 py-[0px]">
          <option value="10" selected>10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        </div>
        <div className="text-gray-500">00:00:00</div>
        <div className="grow flex justify-end space-x-2">
          <button key={pages[0]} onClick={() => onPageChange(pages[0])}><IconAnglesL/></button>
          <button onClick={() => onPageChange(currentPage === 1 ? currentPage : currentPage - 1)}><IconAngleL/></button>
          <div className="px-2">{to}-{from} of {totalItems}</div>
          <button onClick={() => onPageChange(currentPage === totalPages ? currentPage : currentPage + 1)}><IconAngleR/></button>
          <button onClick={() => onPageChange(pages[pages.length-1])}><IconAnglesR/></button>
        </div>
      </div>
  );
};

export default Pagination;
