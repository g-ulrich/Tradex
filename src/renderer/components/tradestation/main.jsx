import React from 'react';
import TSEndpoints from './endpoints';
import Cookies from 'js-cookie';


class TS {
  constructor() {
    this.endpoints = new TSEndpoints();
  }

  getTokenObj(){
    const objString = Cookies.get('TSTokenObj');
    const obj = JSON.parse(objString);
    return obj;
  }

  getAccessToken(){
    const obj = this.getTokenObj();
    return obj.access_token;
  }



}

export default TS;
