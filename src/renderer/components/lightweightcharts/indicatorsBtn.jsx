import React, {useRef, useState, useEffect} from 'react';
import {
  IconFlask,
  IconFlaskVial,
  IconX
} from '../../api/Icons';
import { isSubStr, isFloat, getRandomRGB } from '../../tools/util';
import {StudiesList} from './studies';

export default function IndicatorsBtn({addStudyCallback}){
  const [showStudy, setShowStudy] = useState(false);

 return (
    <>
      <button
              className={`${
                showStudy ? "text-discord-blurple" : "text-discord-white"
              } rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]`}
              onClick={()=>{setShowStudy(!showStudy)}}>
              {showStudy ? <IconFlaskVial /> : <IconFlask />}
              {/* <span className="hidden lg:inline-block">Indicators</span> */}

      </button>

      <StudiesList
          showStudy={showStudy}
          addStudyCallback={addStudyCallback}
          toggleStudies={()=>{setShowStudy(!showStudy)}}
        />

    </>
 );
};

import { CompactPicker } from 'react-color';
