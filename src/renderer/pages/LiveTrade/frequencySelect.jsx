import React, {useRef} from 'react';

export default function FrequencySelect({ selectRef }){
  const frequencyArray = [{interval: '5', name: '5m', unit: 'Minute'},
                          {interval: '1', name: '1m', unit: 'Minute'},
                          {interval: '10', name: '10m', unit: 'Minute'},
                          {interval: '15', name: '15m', unit: 'Minute'},
                          {interval: '30', name: '30m', unit: 'Minute'},
                          {interval: '60', name: '1hr', unit: 'Minute'},
                          {interval: '1', name: '1D', unit: 'Daily'},
                          {interval: '1', name: '1W', unit: 'Weekly'},
                          {interval: '1', name: '1M', unit: 'Monthly'},

                        ];

 return (
    <>

    <div className="flex">
        <select ref={selectRef}
          className="outline-none w-full min-w-[62px] focus:border-none active:border-none text-sm border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
          {
              frequencyArray.map((obj) => (
                <option key={parseInt(Math.random()*10000)} value={JSON.stringify(obj)}>
                  {obj.name}
                </option>
              ))
          }
        </select>
    </div>
    </>
 );
};

