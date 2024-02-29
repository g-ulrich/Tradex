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
<div className="shadow-lg w-full px-2 py-[4px] bg-discord-black sticky top-0 z-[9999]">
        {links.map((obj, i) => (
            <span onClick={() => {handlePageChange(obj.title)}}
              key={`${obj.title}_routing`}
              className="text-lg px-2  rounded-sm text-center hover:bg-discord-blurple cursor-pointer"
              title={obj.title}>
                {obj.icon} {obj.title}
            </span>
        ))}
        {/* <SettingsLinkDialog /> */}

      </div>
        <div className="container-fluid ">
            <div className="row " style={{'height': `calc(100vh - ${titleBarheight()}px)`}}>

                <div className="col-12 p-2 scrollable overflow-y-auto ">
                    <MainView selectedPage={page}/>
                </div>
            </div>
        </div>
      </>
    );
}


export default Routing;
