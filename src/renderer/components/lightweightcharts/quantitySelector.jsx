import React from 'react';
import {
  IconAngleR,
  IconAngleL
} from '../../api/Icons';


export default function QuantitySelector({ options, setOptions }){

  const handleQuantity = (val) => {
    var val = parseInt(val) <= 0 ? 0 : val.toString().toLowerCase() === 'nan' ? 0 : val;
    setOptions(prev=>{
      return {...prev, barsback: val}
    });
  }

  return (
    <>
    <div className="flex">
        <span onClick={()=>{handleQuantity(parseInt(options?.barsback)-1)}}
        className={`flex p-0  items-center px-1 text-white cursor-pointer rounded-l text-center bg-discord-darkerGray hover:bg-discord-darkGray`}><IconAngleL/></span>
        <input type="text" value={options?.barsback} onChange={(e)=>{handleQuantity(parseInt(e.target.value))}}
        className={`flex w-[4em] px-2 py-[3px] outline-none text-white text-center bg-discord-darkerGray hover:bg-discord-darkGray`}/>
        <span onClick={()=>{handleQuantity(parseInt(options?.barsback)+1)}}
        className={`flex p-0 items-center px-1 text-white cursor-pointer rounded-r text-center  bg-discord-darkerGray hover:bg-discord-darkGray`}><IconAngleR/></span>
    </div>
    </>
 );
}

