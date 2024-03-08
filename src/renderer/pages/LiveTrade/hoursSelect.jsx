import React, {useRef} from 'react';

export default function HoursSelect({ selectRef }){

  const hours = [
    'Default',
    'USEQ24Hour',
    'USEQPre',
    'USEQPost',
    'USEQPreAndPost'
  ];
 return (
    <>
    <div className="flex">
        <select ref={selectRef}
          className="outline-none w-full min-w-[62px] focus:border-none active:border-none text-sm border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
          {
              hours.map((item, i) => (
                <option key={parseInt(Math.random()*10000)} value={item}>
                  {item}
                </option>
              ))
          }
        </select>
    </div>
    </>
 );
};

