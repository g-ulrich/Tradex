import React, {useState} from 'react';
import MainView from './MainView';
import { IconCog, IconBank, IconTrade, IconCode} from '../Icons';
import SettingsLinkDialog from './SettingsLinkDialog';
import {titleBarheight} from '../util';


function Routing() {
    const links = [
        {title:"equites", extraClasses: "", icon: <IconBank />},
        {title:"trade", extraClasses: "", icon: <IconTrade />},
        {title:"code", extraClasses: "", icon: <IconCode />}];
    const [page, setPage] = useState('equites');

    const handlePageChange = (pageName) => {
        setPage(pageName);
      };

    return (
      <div className="flex">
        <div className={`flex-none bg-discord-black border-[1px] border-discord-darkestGray max-h-screen `} >
          <div className="grid grid-cols-1">
            {links.map((obj, i) => (
                <div key={`${obj.title}_routing`} className="block text-center my-[4px]">
                    <span onClick={() => {handlePageChange(obj.title)}}
                    title={obj.title} className={`${obj.extraClasses} px-[10px] py-[4px] text-lg hover:bg-discord-blurple hover:rounded cursor-pointer`}>
                    {obj.icon}</span>
                </div>
            ))}
            <SettingsLinkDialog />
          </div>
        </div>
        <div className={`grow scrollable overflow-y-auto p-2`} style={{'height': `calc(100vh - ${titleBarheight()}px)`}}>
          <MainView selectedPage={page}/>
        </div>
      </div>
    );
}


export default Routing;
