import React, {useState, useEffect} from 'react';
import {refreshToken, isSubStr} from '../tools/util';
import {IconWarning, IconAngleR, IconCog, IconCode} from '../api/Icons';

function Code() {
  const ts = window.ts;

  const [lastTimestamp, setLastTimestamp] = useState('');
  const [tokenMsg, setTokenMsg] = useState(null);
  const [tokenidMsg, setTokenidMsg] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [revealTokens, setRevealTokens] = useState(false);

  const info = [
    { key: "Browser", value: window.navigator.appName },
    { key: "Version", value: window.navigator.appVersion },
    { key: "Operating System", value: window.navigator.platform },
    { key: "Language", value: window.navigator.language },
    { key: "Cookies Enabled", value: window.navigator.cookieEnabled },
    { key: "User Agent", value: window.navigator.userAgent },
    { key: "Current URL", value: window.location.href },
  ];

  const getAuthCode = () => {
    setTokenLoading(true);
    window.electron.ipcRenderer.sendMessage('open-login-window', '');
    window.electron.ipcRenderer.once('open-login-window', (obj) => {
      setTokenMsg(obj.url);
    });
  }

  const getAccessToken = () => {
    setTokenLoading(true);
    window.electron.ipcRenderer.sendMessage('getNewAccessToken', '');
    window.electron.ipcRenderer.once('sendNewAccessToken', (obj) => {
      setTokenLoading(!tokenLoading);
    });
  }

  const getCheckRefresh = () => {
    const obj = ts.token;
    if (typeof obj?.timeStamp !== 'undefined') {
      const dt = new Date(obj.timeStamp);
      setLastTimestamp(dt.toLocaleString());
    }
  }

  useEffect(() => {
    getCheckRefresh();
  }, []);

  return (
    <div>
      <div className="mb-2 p-2 rounded bg-discord-darkGray">
        <div className="text-lg">
          <IconCode/> Code
        </div>
        <ul className="ml-5">
          {info.map((obj, index) => (
            <li key={index}><strong>{obj.key}: </strong>{obj.value}</li>
          ))}
        </ul>
      </div>

      <div className="p-2 rounded bg-discord-darkGray">
      <div className="text-lg">
        <IconCog/> Get Refresh Token (Last refresh: {lastTimestamp})
      </div>
      <div className="ml-5">
        <p className="text-gray-500">
          Checking the tokens will fetch the latest time the id token was refreshed.
        </p>
        <button className="mb-2 px-2 rounded border-none hover:bg-discord-green bg-discord-softGreen active:bg-discord-softGreen"
        onClick={getCheckRefresh}>
          Check Tokens <IconAngleR/>
        </button>
        <p className="text-gray-500">
          Showing the tokens will reveal all tokens in the tsToken.json file.
        </p>
        <button className="mb-2 px-2 rounded border-none hover:bg-discord-green bg-discord-softGreen active:bg-discord-softGreen"
        onClick={()=>{setRevealTokens(!revealTokens)}}>
          {revealTokens ? 'Hide ' : 'Show '}Tokens <IconAngleR/>
        </button>
        <div className={`${revealTokens ? '' : 'hidden'} my-2 p-2 rounded bg-discord-black text-white overflow-x-auto`}>
          <pre>{JSON.stringify(ts.token, null, 2)}</pre>
        </div>

        <p className="text-gray-500">
          Getting a new access token will trigger the getNewAccessToken method without checking if its expired.
        </p>
        <button className="px-2 rounded border-none hover:bg-discord-red bg-discord-softRed active:bg-discord-softRed"
        onClick={getAccessToken}>
          <IconWarning/> {tokenLoading ? 'Loading...' : 'Get New Access Token'} <IconAngleR/>
        </button>

        <p className="text-gray-500">
          Getting a new refresh token will open a new login window to the Tradestation authorize endpoint.
        </p>
        <button className="px-2 rounded border-none hover:bg-discord-red bg-discord-softRed active:bg-discord-softRed"
        onClick={getAuthCode}>
          <IconWarning/> {tokenLoading ? 'Loading...' : 'Get New Refresh Token'} <IconAngleR/>
        </button>
        {
          tokenMsg !== null ? (
            <p class={`${isSubStr(tokenMsg, 'code') ? 'text-discord-green' : 'text-discord-red'}`}>
              {isSubStr(tokenMsg, 'code') ? `Success! ${tokenMsg}` : 'Failed to get tokens.'}
            </p>
          ) : (
            <></>
          )
        }

      </div>
</div>
    </div>
  );
}

export default Code;
