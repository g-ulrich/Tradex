import React from 'react';
import TSEndpoints from './endpoints';
import Cookies from 'js-cookie';


export class TS {
  constructor() {
    this.endpoints = new TSEndpoints();
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

  getAccessToken(){
    const obj = this.getTokenObj();
    return obj?.access_token;
  }



}

export default TS;
