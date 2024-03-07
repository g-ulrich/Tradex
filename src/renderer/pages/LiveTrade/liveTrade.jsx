import React, { useEffect, useState } from 'react';
import CreateAlgo from './snippets';
import { IconX } from '../../api/Icons';

document.title = 'Tradex | LiveTrade';

export default function LiveTrade() {
 const [algos, setAlgos] = useState([]);
 const [algoRefs, setAlgoRefs] = useState([]);

 const deleteAlgo = (id, index) => {
    console.log("Algo ", id, index);
    setAlgos(prev => prev.filter((_, i) => i !== index));
    setAlgoRefs(prev => prev.filter((_, i) => i !== index));
 };

 const newAlgo = () => {
    const id = parseInt(Math.random()*10000);
    // Instead of creating a ref here, we'll use a callback ref
    const algoRef = (el) => {
      if (el) {
        setAlgoRefs(prev => [...prev, el]);
      }
    };

    setAlgos(prev => [
      ...prev,
      <div
        ref={algoRef}
        className="col-4 mx-0 my-2"
        key={prev.length}>
          <div className="rounded border border-discord-black shadow-lg">
            <div className="flex items-center">
              <div className="flex m-1 text-gray-500 text-sm">Algo ID: {id} {prev.length}</div>
              <div className="grow">

                <button
                  onClick={()=>deleteAlgo(id, prev.length)}
                  className={`m-1 float-right
                    px-2 py-[3px] rounded text-sm
                    bg-discord-softRed active:bg-discord-softRed`}>
                    <IconX/>
                </button>
              </div></div>

            <CreateAlgo/>
          </div>
      </div>
    ]);
 }

 useEffect(()=>{
    newAlgo();
 },[]);

 return (
    <>
      <div className="container-fluid ">
        <button
          className="shadow mb-2 px-3 rounded text-lg bg-discord-softBlurple active:bg-discord-blurple"
          onClick={newAlgo}>
          Create Instance
        </button>
        <div class="row">
          {algos}
        </div>
      </div>
    </>
 );
}

