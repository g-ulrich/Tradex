import './App.css';
import React, {useState, useEffect} from 'react';
import Routing from './pages/menu/Routing';
import {TS} from './api/tradestation/main';
// import audioFile from '../../assets/ding.wav';
window.ts = new TS();

export default function App() {
  const [token, setToken] = useState(null);
  const [intervalItem, setIntervalItem] = useState(null);

  useEffect(() => {
    setToken(window.ts.token);
    const interval = setInterval(() => {
      setToken(window.ts.token)
    }, 1000);
    setIntervalItem(interval);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (intervalItem !== null && token !== null){
      clearInterval(intervalItem);
    }
  }, [token]);

  document.body.classList.add('bg-discord-darkerGray', 'text-discord-white');
  return (
    <>
      {
        token !== null ? (
          <div className={`bg-discord-darkerGray`}>
            <Routing/>
          </div>
        ) : (
          <div className="rounded m-2 bg-discord-darkestGray p-2">
            Loading Tokens...
          </div>
        )
      }

    </>
  );
}
