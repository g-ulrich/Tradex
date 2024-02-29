import React, { useState,useRef, useEffect } from "react";
import {
  IconSearch,
} from "../../api/Icons";


export default function SymbolSearchInput({ setSymbol, marketType, assetType}) {
  const asset = assetType ? assetType : "STOCK";
  const searchRef = useRef();
  const market = marketType ? `${marketType.trim()} ` : '';
  const [symbolCheck, setSymbolCheck] = useState(null);

  useEffect(() => {
    if (symbolCheck) {
      if (symbolCheck[0]?.Symbol && symbolCheck[0]?.AssetType === asset) {
        setSymbol(symbolCheck[0]?.Symbol);
        console.log(symbolCheck[0]?.Symbol);
      }else{
        console.log("Not a Symbol.");
      }
    }
  }, [symbolCheck]);

  const handleKeyPress = (event) => {
    if (searchRef.current !== null) {
      const sym = searchRef.current?.value.toUpperCase();
      if (event.key === 'Enter') {
        window.ts.marketData.setSymbolDetails(setSymbolCheck, sym);
      } else if (!event.key){ // on click
        window.ts.marketData.setSymbolDetails(setSymbolCheck, sym);
      }
    }
  };

  return (
     <>
      <div className="flex">
      <input
        ref={searchRef}
         type="search"
         className={`uppercase block text-discord-white outline-none px-2 py-[3px] text-sm border border-none rounded-l bg-discord-darkerGray hover:bg-discord-darkGray`}
         placeholder={`${market}Search`}
         onKeyPress={handleKeyPress}
       />
       <button onClick={handleKeyPress} className="px-2 bg-discord-softBlurple hover:bg-discord-blurple active:bg-discord-softBlurple rounded-r">
         <IconSearch />
       </button>
      </div>
     </>
  );
 }
