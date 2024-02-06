import React, {useState} from 'react';
import MainView from './MainView';
import { IconCog, IconBank, IconTrade, IconCode} from '../../api/Icons';
import SettingsLinkDialog from './SettingsLinkDialog';
import {titleBarheight} from '../../tools/util';


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
      <>
        <div className="container-fluid">
            <div className="row">
                <div className="col-menu m-0 p-0 bg-discord-black" style={{'height': `calc(100vh - ${titleBarheight()}px)`}}>
                  {links.map((obj, i) => (
                      <div onClick={() => {handlePageChange(obj.title)}}
                        key={`${obj.title}_routing`}
                        className="block text-center my-[4px] hover:bg-discord-blurple cursor-pointer">
                          <span title={obj.title}
                          className={`${obj.extraClasses} px-[5px] py-[4px] text-lg `}>
                          {obj.icon}</span>
                      </div>
                  ))}
                  {/* <SettingsLinkDialog /> */}

                </div>
                <div className="col scrollable overflow-y-auto p-2" style={{'height': `calc(100vh - ${titleBarheight()}px)`}}>
                    <MainView selectedPage={page}/>
                </div>
            </div>
        </div>
      </>
    );
}


export default Routing;
