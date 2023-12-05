import React, {useState} from 'react';
import MainView from './MainView';
import { IconCog, IconBank, IconTrade } from '../Icons';
import SettingsLinkDialog from './SettingsLinkDialog';


function Routing(heightOffset) {
    const links = [
        {title:"account", extraClasses: "", icon: <IconBank />},
        {title:"trade", extraClasses: "", icon: <IconTrade />}];
    const [page, setPage] = useState('account');

    const handlePageChange = (pageName) => {
        setPage(pageName);
      };

    return (
      <div className="flex">
        <div className="flex-none bg-discord-black border-[1px] border-discord-darkestGray" style={{'height': `calc(100vh - ${heightOffset.val}px)`}}>
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
        <div className="grow h-full scrollable overflow-y-auto p-2">
          <MainView selectedPage={page}/>
        </div>
      </div>
    );
}


export default Routing;