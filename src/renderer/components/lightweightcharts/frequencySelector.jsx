import React, {useRef} from 'react';

export default function FrequencySelection({ options, setOptions }){
  const selectFreqRef = useRef();
  const frequencyArray = [{val: '5', freq: '5m'},
                          {val: '1', freq: '1m'},
                          {val: '10', freq: '10m'},
                          {val: '15', freq: '15m'},
                          {val: '30', freq: '30m'},
                          {val: '60', freq: '1hr'}
                        ];


 return (
    <>
    <div className="flex">
        <select ref={selectFreqRef}
        onChange={()=>{
          console.log("interval", selectFreqRef.current.value.toLowerCase());
          setOptions({...options,
            interval: selectFreqRef.current.value.toLowerCase()});
        }}
        className="outline-none focus:border-none active:border-none text-sm border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
          {
              frequencyArray.map((obj) => (
                <option key={obj.val} value={obj.val}>
                  {obj.freq}
                </option>
              ))
          }
        </select>
    </div>
    </>
 );
};

