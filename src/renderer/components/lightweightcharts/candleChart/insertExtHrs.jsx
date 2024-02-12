import React, {useState, useEffect} from 'react';

import {
IconClock
} from "../../../api/Icons";

export default function ExtHrs({options, setOptions}) {

  return (
    <span
      onClick={
        ()=>{
          setOptions(
            prev=>{
            return {...prev, sessiontemplate:
              (prev.sessiontemplate === 'Default' ? 'USEQ24Hour' : 'Default')}
            }
          );
        }
      }
      title={`Session: ${options.sessiontemplate}`}
      className={` text-lg absolute right-2 bottom-2 ml-2 cursor-pointer ${options.sessiontemplate === 'Default' ? 'text-gray-500' : 'text-discord-blurple'}`}>
      <IconClock/>
    </span>
  );
}
