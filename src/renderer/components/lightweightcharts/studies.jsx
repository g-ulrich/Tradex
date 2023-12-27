import React, { useState, useEffect } from 'react';
import { isSubStr, isFloat } from '../util';
import Slide from '@mui/material/Slide';
import { IconAdd, IconFlask, IconX } from '../Icons';

export default function StudiesList({ showStudy, talibFuncs, addStudyCallback, toggleStudies }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (e, obj, item) => {
    const { id, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  // useEffect(() => {
  //   // Access the input values in the inputValues state variable
  //   console.log(inputValues);
  // }, [inputValues]);

  return (
    <Slide direction="down" in={showStudy} mountOnEnter unmountOnExit>
      <div className="p-2 z-[9999] ml-2 mt-[4px] absolute inset-0 rounded border-discord-black border shadow-2xl bg-discord-black max-h-[300px] min-h-[100px] scroll-container overflow-y-auto max-w-[400px]">
        <div className="flex text-lg items-center">
          <input
            type="search"
            placeholder={`Search Indicators...`}
            className="flex px-2 mb-2 border border-discord-darkestgray bg-discord-darkestGray rounded text-discord-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="grow text-right"><span className="px-2 py-[4px] rounded cursor-pointer hover:bg-discord-darkestGray" onClick={toggleStudies}><IconX/></span></div>
        </div>
        {talibFuncs.map((obj, i) => {
          if (isSubStr(obj.name, 'get') && isSubStr(obj.name, searchQuery)) {
            return (
              <div key={i} className="hover:bg-discord-darkestGray flex border-b border-gray-600 items-center">
                <div className="flex items-center justify-start">
                  <button
                    onClick={() => addStudyCallback(obj)}
                    className="mr-2 my-[4px] px-2 py-[4px] border border-discord-softGreen hover:bg-discord-softGreen rounded text-discord-softGreen hover:text-discord-white"
                  >
                    <IconAdd />
                  </button>
                  {obj.name.replace('get', '')}
                </div>
                <div className="grow justify-end">
                  {/* LOOP through variables */}
                  {obj.parameters.map((item, j) => {
                    if (item.var !== 'obj') {
                      return (
                        <div key={j} className="float-right flex pl-2 justify-end">
                          <b >{item.var}</b>-
                          <input
                            id={`${obj.name}_${item.var}`}
                            value={inputValues[`${obj.name}_${item.var}`] || `${item.val}`}
                            type="number"
                            className="border border-discord-darkestgray bg-discord-darkestGray px-[4px]  rounded w-[50px]"
                            step={isSubStr(item.val, '.') ? '.01' : '1'}
                            min={isSubStr(item.val, '.') ? '.01' : '1'}
                            max="500"
                            onChange={(e) => handleInputChange(e, obj, item)}
                          ></input>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </Slide>
  );
}
