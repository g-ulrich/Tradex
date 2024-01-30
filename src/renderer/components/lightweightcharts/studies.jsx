import React, { useState, useEffect } from 'react';
import { isSubStr, isFloat, getRandomRGB } from '../../tools/util';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import {
  IconAdd,
  IconFlask,
  IconX,
  IconArrowDown,
  IconArrowUp,
  IconSearch,
  IconColor
} from '../../api/Icons';
import * as talib from './talib';
// import
//   ColorPicker
// from '../colorPicker';
import { CompactPicker } from 'react-color';


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

export const StudiesList = ({ showStudy, addStudyCallback, toggleStudies }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [hideParam, setHideParam] = useState(null);
  const [colorVal, setColorVal] = useState(getRandomRGB());
  const [toggleColorPicker, setToggleColorPicker] = useState(false);
  const talibFuncs = getAvailableTaFuncs();

  const handleColorChange = (val) => {
    setColorVal(val.hex)
  }

  const toggleParam = (obj) => {
    if (typeof hideParam?.name !== 'undefined' && hideParam?.name !== obj.name) {
      setHideParam(obj);
      setColorVal(getRandomRGB());
      setToggleColorPicker(false);
    } else if (typeof hideParam?.name !== 'undefined') {
      setHideParam(null);
    } else {
      setHideParam(obj);
      setToggleColorPicker(false);
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
    <>
     <Fade in={showStudy} timeout={800} easing="ease">
    <div className={`${showStudy ? '' : 'hidden'}  flex items-center justify-center absolute z-[999]  w-full h-full`}>
      <div onClick={toggleStudies} className={`${showStudy ? '' : 'hidden'} absolute z-[998] bg-discord-black bg-opacity-50 w-full h-full`}></div>
      <div className="absolute z-[999] mt-2 text-white p-2 rounded border-discord-black border shadow-2xl bg-discord-black max-h-[300px] min-h-[100px] scroll-container overflow-y-auto w-[300px]">
      <div className="text-lg items-center bg-discord-black border-b border-discord-darkestGray shadow-lg" style={{ position: "sticky", top: -8 }}>
        <div className="flex mb-2 z-[9999]">
          <div className="flex text-left text-2xl">
            <span>Indicators</span>
          </div>
          <div className="grow text-right">
            <span className="px-2 py-[4px] rounded cursor-pointer hover:bg-discord-darkestGray" onClick={toggleStudies}>
              <IconX/>
            </span>
          </div>
        </div>
        <div className="absolute  text-sm flex items-center ps-2 pt-[6px] pointer-events-none">
          <IconSearch />
        </div>
        <input
          type="search"
          placeholder={`Search...`}
          className="block w-full ps-8 mb-[4px] text-discord-white outline-none  py-[4px] px-2 text-sm border border-none rounded bg-discord-darkerGray hover:bg-discord-darkGray"
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
                <div className={`rounded bg-discord-black p-2 w-full ${typeof hideParam?.name !== 'undefined' && obj.name === hideParam.name ? '' : 'hidden'}`}>
                    <div>
                    <div className="mb-[4px] flex justify-center">
                      <button onClick={() => setToggleColorPicker(!toggleColorPicker)} style={{background: colorVal}} className="border-2 hover:border-white text-center px-2 rounded">
                        <IconColor/> Color Picker {toggleColorPicker ? <IconArrowUp/> : <IconArrowDown/>}</button>
                    </div>
                    <div className="w-full relative">
                      <Fade in={toggleColorPicker} timeout={1000} easing="ease">
                        <div className={`${toggleColorPicker ? '' : 'hidden'} mb-[4px] shadow-lg absolute w-full flex items-center justify-center`}>
                              <CompactPicker style={{background: colorVal}} color={colorVal} onChange={handleColorChange} />
                        </div>
                      </Fade>
                    </div>
                  {obj.parameters.map((item, j) => {
                    if (item.var !== 'obj') {
                      return (
                        <div key={j} className="grid grid-cols-2">
                          <div>{item.var}</div>
                          <div>
                            <input
                              id={`${obj.name}_${item.var}`}
                              value={inputValues[`${obj.name}_${item.var}`] || `${item.val}`}
                              type="number"
                              className="m-[2px] border border-transparent outline-none bg-discord-darkerGray hover:bg-discord-darkGray hover:border-discord-black shadow-md px-[4px] rounded w-50"
                              step={isSubStr(item.val, '.') ? '.01' : '1'}
                              min={isSubStr(item.val, '.') ? '.01' : '1'}
                              max="500"
                              onChange={(e) => handleInputChange(e, obj, item)}
                            />
                          </div>
                        </div>
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
    </div>
    </Fade>
    </>
  );
}
