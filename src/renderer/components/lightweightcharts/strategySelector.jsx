import React, {useRef} from 'react';

export default function StrategySelector({ strategy, setStrategy }){
  const selectRef = useRef();
  const funcNames = ['test_'];


 return (
    <>
    <div className="flex">
        <select ref={selectRef}
        onChange={()=>{
          setOptions({...options,
            interval: selectRef.current.value.toLowerCase()});
        }}
        className="outline-none focus:border-none active:border-none text-sm border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
          {
              funcNames.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))
          }
        </select>
    </div>
    </>
 );
};

