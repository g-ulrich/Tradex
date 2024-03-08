import { useState, useRef, useEffect } from 'react';

export default function AccountSelect({selectRef}) {;
  const [accounts, setAccounts] = useState([]);
  const [acountsInterval, setAcountsInterval] = useState();
  const [selected, setSelected] = useState();
  const keyName = "AccountType";


  useEffect(()=>{
    window.ts.account.setAccounts(setAccounts);
    const loop = setInterval(() => {
      if (!accounts) {
        window.ts.account.setAccounts(setAccounts);
      }
    }, 1000);
    setAcountsInterval(loop);
    return () => {
      clearInterval(loop);
    }
  },[]);


  useEffect(()=>{
    if (accounts) {
      clearInterval(acountsInterval);
    }
  },[accounts]);


  return (
  <>
  <div className="flex">
    <select ref={selectRef}
      className="outline-none w-full min-w-[62px] focus:border-none active:border-none text-sm border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
        {/* <option key={-1} value={'null'}>...</option> */}
        { !accounts ? (<></>) :
          Array.isArray(accounts) ?
          (
              <>
                {accounts.map((obj, index) => (
                  <option key={parseInt(Math.random()*10000)} value={JSON.stringify(obj)}>
                    {obj?.[keyName]}
                  </option>
                ))}
              </>
            ) : (
            <option key={0} value={JSON.stringify(accounts)}>
              {accounts?.[keyName]}
            </option>
            )
        }
      </select>
      </div>
  </>
  );
 }
