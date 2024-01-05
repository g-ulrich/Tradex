import React, { useState, useEffect } from 'react';
import { isSubStr, isFloat, getRandomRGB } from '../util';
import Slide from '@mui/material/Slide';
import { IconAdd, IconFlask, IconX, IconArrowDown, IconArrowUp } from '../Icons';
import { MuiColorInput } from 'mui-color-input';
import * as talib from './talib';


export const getAvailableTaFuncs = () => {
  const file = talib;
  const functions = [];

  for (const property in file) {
    if (typeof file[property] === 'function' && !property.startsWith('render')) {
      const functionInfo = {
        color: getRandomRGB(),
        name: property,
        parameters: getFunctionParameters(file[property])
      };
      functions.push(functionInfo);
    }
  }

  return functions;
}

export const getFunctionParameters = (func) => {
  const parameterNames = [];
  const functionString = func.toString();

  const parameterRegex = /\(([^\)]*)\)\s*=>/;
  const match = functionString.match(parameterRegex);

  if (match && match[1]) {
    const parameters = match[1].split(',');
    for (const parameter of parameters) {
      const paramNameArr = parameter.trim().replaceAll(' ', '').split('=');
        parameterNames.push({var: paramNameArr[0], val: paramNameArr[paramNameArr.length-1]});
    }
  }

  return parameterNames;
}

export default function StudiesList({ showStudy, addStudyCallback, toggleStudies }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [hideParam, setHideParam] = useState(null);
  const [colorVal, setColorVal] = useState(getRandomRGB());
  const talibFuncs = getAvailableTaFuncs();

  const handleColorChange = (val) => {
    setColorVal(val)
  }

  const toggleParam = (obj) => {
    if (typeof hideParam?.name !== 'undefined' && hideParam?.name !== obj.name) {
      setHideParam(obj);
      setColorVal(getRandomRGB());
    } else if (typeof hideParam?.name !== 'undefined') {
      setHideParam(null);
    } else {
      setHideParam(obj);
      setColorVal(getRandomRGB());
    }
  }

  const handleInputChange = (e, obj, item) => {
    const { id, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };


  return (
    <Slide direction="down" in={showStudy} mountOnEnter unmountOnExit>
      <div className="mt-[15px] ml-[-8px] text-white p-2 z-[999] absolute rounded border-discord-black border shadow-2xl bg-discord-black max-h-[300px] min-h-[100px] scroll-container overflow-y-auto w-[300px]">
      <div className="text-lg items-center bg-discord-black border-b border-discord-darkestGray shadow-lg" style={{ position: "sticky", top: -8 }}>
        <div className="flex mb-2">
          <div className="flex text-left text-2xl">
            <span>Indicators</span>
          </div>
          <div className="grow text-right">
            <span className="px-2 py-[4px] rounded cursor-pointer hover:bg-discord-darkestGray" onClick={toggleStudies}>
              <IconX/>
            </span>
          </div>
        </div>
        <input
          type="search"
          placeholder={`Search...`}
          className="w-full px-2 mb-2 border border-discord-darkestgray bg-discord-darkestGray rounded text-discord-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}/>
      </div>

        {talibFuncs.map((obj, i) => {
          if (isSubStr(obj.name, 'get') && isSubStr(obj.name, searchQuery)) {
            return (
              <div key={i} className="flex flex-wrap hover:bg-discord-darkestGray border-b border-gray-600 items-center">
                <div className="flex items-center justify-start">
                  <button
                    onClick={() => {addStudyCallback(obj, colorVal); setColorVal(getRandomRGB());}}
                    className="mr-2 my-[4px] px-2 py-[4px] border border-discord-softGreen hover:bg-discord-softGreen rounded text-discord-softGreen hover:text-discord-white">
                    <IconAdd />
                  </button>
                  {obj.name.replace('get', '')}
                </div>
                <div className="grow text-right">
                  <span title="View/Edit Params" className="mr-[2px] px-2 py-[4px] rounded cursor-pointer hover:bg-discord-black"
                  onClick={() => toggleParam(obj)}>{typeof hideParam?.name !== 'undefined' && obj.name === hideParam.name ? <IconArrowUp/> : <IconArrowDown/>}</span>
                </div>
                <div style={{background: colorVal}} className={`rounded p-2 w-full ${typeof hideParam?.name !== 'undefined' && obj.name === hideParam.name ? '' : 'hidden'}`}>
                  {/* LOOP through variables */}
                    <MuiColorInput value={colorVal} onChange={handleColorChange} />
                    <div className="mt-[4px] flex flex-wrap">
                  {obj.parameters.map((item, j) => {
                    if (item.var !== 'obj') {
                      return (
                        <span key={j} className="flex rounded text-discord-black mr-2">
                          <b >{item.var}</b>-
                          <input
                            id={`${obj.name}_${item.var}`}
                            value={inputValues[`${obj.name}_${item.var}`] || `${item.val}`}
                            type="number"
                            style={{background: colorVal}}
                            className="m-[2px] border border-transparent hover:border-discord-black shadow-md px-[4px]  rounded w-[50px]"
                            step={isSubStr(item.val, '.') ? '.01' : '1'}
                            min={isSubStr(item.val, '.') ? '.01' : '1'}
                            max="500"
                            onChange={(e) => handleInputChange(e, obj, item)}
                          ></input>
                        </span>
                      );
                    }
                  })}
                  </div>
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
