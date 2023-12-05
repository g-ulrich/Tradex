import React, {useState} from 'react';
import MainView from './MainView';

function NavBar(pageTitle) {
    const [page, setPage] = useState('account');

    const handlePageChange = (pageName) => {
        setPage(pageName);
      };
 
    return (
    <div className="mx-[4px] h-full">
        <nav className="bg-discord-black flex border-[1px] border-discord-darkestGray rounded-t">
        <a onClick={() => {handlePageChange('account')}} className="inline-block  pl-3 pr-3 cursor-pointer hover:bg-discord-darkerGray hover:shadow active:shadow">Account</a>
        <a onClick={() => {handlePageChange('trade')}} className="inline-block  pl-3 pr-3 cursor-pointer hover:bg-discord-darkerGray hover:shadow active:shadow">Trade</a>
        </nav>
        <div className="bg-discord-darkestGray rounded-b h-full">
            <MainView selectedPage={page}/>
        </div>
    </div>
    );
}

export default NavBar;