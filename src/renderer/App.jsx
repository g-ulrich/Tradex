import './App.css';
import React, {useEffect} from 'react';
import Routing from './components/menu/Routing';
import Cookies from 'js-cookie';

function refreshToken() {
  window.electron.ipcRenderer.sendMessage('refreshToken', '');
    window.electron.ipcRenderer.once('refreshToken', (arg) => {
      const objString = JSON.stringify(arg.ts);
      Cookies.set('TSTokenObj', objString);
      Cookies.set('AlphaAPI', arg.alpha);
    });
}

export default function App() {
  useEffect(() => {
    refreshToken();
    const interval = setInterval(refreshToken, 10000);
    return () => {clearInterval(interval);};
  }, []);
  document.body.classList.add('bg-discord-darkerGray', 'text-discord-white');
  return (
    <div className={`bg-discord-darkerGray`}>
        <Routing/>
    </div>
  );
}
