import React, { useEffect, useState, useRef } from 'react';
import AccountSelect from './accountSelect';
import SymbolSearchInput from '../../components/lightweightcharts/symbolSearchInput';
import FrequencySelection from '../../components/lightweightcharts/frequencySelector';
import QuantitySelector from '../../components/lightweightcharts/quantitySelector';
import StrategySelector from '../../components/lightweightcharts/strategySelector';


import {
  extractValuesById
} from '../../tools/util';

export default function Form({callBackFunc}) {

  const [selectedAccount, setSelectedAccount] = useState();
  const [symbol, setSymbol] = useState();
  const symbolInputRef = useRef();
  const [strategy, setStrategy] = useState();
  const [barOptions, setBarOptions] = useState({
                                                interval : '5',
                                                unit : 'Minute',
                                                barsback : '300',
                                                sessiontemplate : 'Default'
                                              });



  return (
  <>

        <div className="flex bg-discord-black px-2 py-[3px] items-center">
        <button
            onClick={()=>{callBackFunc(
              {symbol: symbol,
                options: barOptions,
                strategy: strategy,
                account: selectedAccount}
            )}}
            type="submit"
            className="flex text-lg px-2 py-[3px] hover:bg-discord-blurple active:bg-discord-softBlurple bg-discord-softBlurple text-white rounded ">
            Create Instance
          </button>          <span className="grow px-2 text-right">Account</span>
          <AccountSelect setter={setSelectedAccount}/>
          <span className="grow px-2 text-right">Symbol</span>
          <input
              ref={symbolInputRef}
              type="text"
              className={`uppercase block w-[6em] text-discord-white outline-none px-2 py-[3px] text-sm border border-none rounded bg-discord-darkerGray hover:bg-discord-darkGray`}
              onInput={()=>{setSymbol(symbolInputRef.current?.value.toUpperCase())}}
            />
          <span className="grow px-2 text-right">Options</span>
           <FrequencySelection options={barOptions} setOptions={setBarOptions}/>
          <span className="grow px-2 text-right">Bars</span>
           <QuantitySelector options={barOptions} setOptions={setBarOptions}/>
          <span className="grow px-2 text-right">Strategy</span>
           <StrategySelector strategy={strategy} setStrategy={setStrategy}/>


        </div>






  </>
  );
}


