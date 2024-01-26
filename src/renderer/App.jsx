import './App.css';
import React, {useEffect} from 'react';
import Routing from './components/menu/Routing';
import {refreshToken} from './components/util';


export default function App() {

  useEffect(() => {
    refreshToken();
    const interval = setInterval(refreshToken, 30000);
    return () => {clearInterval(interval);};
  }, []);
  document.body.classList.add('bg-discord-darkerGray', 'text-discord-white');
  return (
    <div className={`bg-discord-darkerGray`}>
        <Routing/>
    </div>
  );
}
