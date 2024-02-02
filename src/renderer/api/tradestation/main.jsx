import React from 'react';
import TSEndpoints from './endpoints';
import Cookies from 'js-cookie';
import {currentESTTime} from '../../tools/util';
import {Accounts} from './accounts';
import {MarketData} from './marketData';


export class TS {
  constructor() {
    this.endpoints = new TSEndpoints();
    this.refreshToken();
    this.token = null;
    // Nested Classes
    this.account = null;
    this.marketData = null;
  }

  info(msg=""){
    console.log(`${currentESTTime()} TS [INFO] - ${msg}`)
  }

  error(msg=""){
    console.error(`${currentESTTime()} TS [ERROR] - ${msg}`)
  }

  initializeClasses(accessToken){
    this.info(`TS Classes Refreshed (token: ${typeof accessToken === 'string' ? 'success': 'failure'})`);
    this.account = new Accounts(accessToken);
    this.marketData = new MarketData(accessToken);
    console.log(accessToken.length, accessToken);
  }

  async refreshToken(){
    window.electron.ipcRenderer.sendMessage('getRefreshToken', '');
    window.electron.ipcRenderer.once('sendRefreshToken', (arg) => {
      // const objString = JSON.stringify(arg.ts);
      this.token = arg.ts;
      this.initializeClasses(this.token?.access_token);
      // Cookies.set('TSTokenObj', objString);
    });
  }

  // getTokenObj(){
  //   if (Cookies.get('TSTokenObj')) {
  //     const objString = Cookies.get('TSTokenObj');
  //     const obj = JSON.parse(objString);
  //     return obj;
  //   }else{
  //     return null;
  //   }
  // }

  // getTokenId(){
  //   try {
  //     this.refreshToken();
  //   } catch (error) {
  //     console.error("[ERROR] ts.refreshToken()", error)
  //   }
  //   const cookieToken = this.getTokenObj();
  //   if (this.token !== null) {
  //     return this.token?.access_token || null;
  //   } else if (cookieToken !== null) {
  //     return cookieToken?.access_token || null;
  //   } else {
  //     return null;
  //   }
  // }

  // getAccessToken(){
  //   const obj = this.getTokenObj();
  //   return obj?.access_token || null;
  // }
}

export default TS;
