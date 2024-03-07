import React, {useState} from 'react';
import MainView from './MainView';
import { IconCog, IconBank, IconTrade, IconCode} from '../../api/Icons';
import SettingsLinkDialog from './SettingsLinkDialog';
import {titleBarheight} from '../../tools/util';


function Routing() {
    const links = [
        {title:"liveTrade", icon: <IconTrade />},
        {title:"equites", icon: <IconBank />},
        {title:"code", icon: <IconCode />}];
    const [page, setPage] = useState('liveTrade');


    return (
      <>

      <div className="flex" style={{'height': `calc(100vh - ${titleBarheight()}px)`}}>
      <div className=" flex bg-discord-black w-[40px] h-full">
        <div className="container-fluid">
          <div className="row">
            {links.map((obj, i) => (
              <span onClick={() => setPage(obj.title)}
                key={`${obj.title}_routing`}
                className="col-12 text-lg px-2  rounded-sm text-center hover:bg-discord-blurple cursor-pointer"
                title={obj.title}>
                  {obj.icon}
              </span>
          ))}
          </div>
        </div>

      </div>
      <div className="grow p-2 scrollable overflow-y-auto ">
          <MainView selectedPage={page}/>
      </div>
      </div>
      </>
    );
}


export default Routing;
