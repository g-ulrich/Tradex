import React from 'react';
import TSEndpoints from './endpoints';
import Cookies from 'js-cookie';


export class TS {
  constructor() {
    this.endpoints = new TSEndpoints();
    this.refreshToken();
    this.token = null;
  }

  async refreshToken(){
    window.electron.ipcRenderer.sendMessage('refreshToken', '');
      window.electron.ipcRenderer.once('refreshToken', (arg) => {
        const objString = JSON.stringify(arg.ts);
        this.token = arg.ts;
        Cookies.set('TSTokenObj', objString);
      });
  }

  getTokenObj(){
    if (Cookies.get('TSTokenObj')) {
      const objString = Cookies.get('TSTokenObj');
      const obj = JSON.parse(objString);
      return obj;
    }else{
      return null;
    }
  }

  getTokenId(){
    try {
      this.refreshToken();
    } catch (error) {
      console.error("[ERROR] ts.refreshToken()", error)
    }
    const cookieToken = this.getTokenObj();
    if (this.token !== null) {
      return this.token?.access_token || null;
    } else if (cookieToken !== null) {
      return cookieToken?.access_token || null;
    } else {
      return null;
    }
  }

  getAccessToken(){
    const obj = this.getTokenObj();
    return obj?.access_token || null;
  }
}

export default TS;
