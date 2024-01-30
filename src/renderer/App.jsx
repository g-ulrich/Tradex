import './App.css';
import React, {useState, useEffect} from 'react';
import Routing from './pages/menu/Routing';
import {TS} from './api/tradestation/main';

export default function App() {
  const [timeStamp, setTimeStamp] = useState(-1);
  const [intervalItem, setIntervalItem] = useState(null);
  const ts = new TS(); // inits the refresh token

  useEffect(() => {
    const getTimeStamp = () => {
      var t = ts.getTokenObj();
      const stamp = typeof t?.timeStamp !== 'undefined' ? (Date.now() - t.timeStamp) / 1000 / 60 : -1;
      if (stamp <= 0 || stamp > 19) {
        ts.refreshToken();
      }
      return stamp;
    }
    setTimeStamp(getTimeStamp());
    const interval = setInterval(() => {
      setTimeStamp(getTimeStamp());
    }, 1000);
    setIntervalItem(interval)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (intervalItem !== null && timeStamp >= 0 &&  timeStamp < 20){
      clearInterval(intervalItem);
    }
  }, [timeStamp]);

  document.body.classList.add('bg-discord-darkerGray', 'text-discord-white');
  return (
    <>
      {
        timeStamp >= 0 && timeStamp < 20 ? (
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
