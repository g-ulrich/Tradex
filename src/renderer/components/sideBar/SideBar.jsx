import React , {useState} from 'react';
import { basicCard } from '../util';
import {IconMenu, IconArrowDown, IconArrowUp} from '../Icons';
import AccountWidget from './AccountWidget';


export default function SideBar(){
    
    const [sideBarWidgets, setSideBarWidgets] = useState([
        {key: 0, title: 'Account', content: <AccountWidget/>, collapsed: false }
      ]);
      const setChangeArrow = (widget) => {
        setSideBarWidgets((prevWidgets) =>
          prevWidgets.map((prevWidget) =>
            prevWidget === widget ? { ...prevWidget, collapsed: !prevWidget.collapsed } : prevWidget
          )
        );
      };

    
      return (
          <div className="grid grid-cols-1 scrollable overflow-y-auto">
            {sideBarWidgets.map((obj, i) => (
              <div className="block border-[1px] border-discord-darkestGray ml-[4px] mb-[4px] rounded">
                <div className="flex bg-discord-black">
                  <div className="pl-3 flex-none text-discord-white2">
                    <button className="cursor-pointer mr-2" onClick={() => setChangeArrow(obj)}>
                      {obj.collapsed ? <IconArrowUp/> : <IconArrowDown/>}
                    </button>
                    {obj.title}
                  </div>
                  <div className="grow pr-3 text-right cursor-grab"><a><IconMenu /></a></div>
                </div>
                <div className={`py-[2px] bg-discord-darkestGray h-[200px] scrollable overflow-y-auto ${obj.collapsed ? 'hidden' : ''}`}>
                  {obj.content}
                </div>
              </div>
            ))}
          </div>
      );
}