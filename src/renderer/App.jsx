import './App.css';
import React, {useEffect} from 'react';
import {getHeightFromClass} from './components/util';
import Routing from './components/menu/Routing';
import Cookies from 'js-cookie';

function refreshToken() {
  window.electron.ipcRenderer.sendMessage('refreshToken', '');
    window.electron.ipcRenderer.once('refreshToken', (arg) => {
      const objString = JSON.stringify(arg);
      Cookies.set('TSTokenObj', objString);
    });
}

export default function App() {
  useEffect(() => {
    refreshToken();
    const interval = setInterval(refreshToken, 10000);
    return () => {clearInterval(interval);};
  }, []);
  document.body.classList.add('bg-discord-darkerGray', 'text-discord-white');
  const titleBarheight = getHeightFromClass("cet-titlebar");
  return (
    <div className="bg-discord-darkerGray" style={{'height': `calc(100vh - ${titleBarheight}px)`}}>
        <Routing val={titleBarheight}/>
    </div>
  );
}
