import './App.css';
import React from 'react';
import Routing from './components/menu/Routing';
import {TS} from './api/tradestation/main';

export default function App() {
  const ts = new TS(); // inits the refresh token

  document.body.classList.add('bg-discord-darkerGray', 'text-discord-white');
  return (
    <>
      <div className={`bg-discord-darkerGray`}>
        <Routing/>
      </div>
    </>
  );
}
