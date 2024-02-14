import React, {useState, useEffect} from 'react';
import {
  getMarketOpenStatus
} from '../../components/lightweightcharts/util';
import {
  IconHeart,
  IconHeartPulse
} from '../../api/Icons';

export default function IsStreaming({symbol, streamId}){
  const [streaming, setStreaming] = useState("");
  const [checkInterval, setCheckInterval] = useState(null);

  const isItStreaming = (sym, id) =>{
    var res = "";
    if (window.ts.marketData.allStreams?.[`${id}${sym}`]) {
      res = getMarketOpenStatus() === 'Closed' ? 'pulse' : 'on';
    }
    setStreaming(res);
  }

  useEffect(() => {
    clearInterval(checkInterval);
    isItStreaming(symbol, streamId);
    const interval = setInterval(() => {
      isItStreaming(symbol, streamId);
    }, 1000);
    setCheckInterval(checkInterval);
    return () => {
      clearInterval(interval);
    }
  }, [symbol, streamId]);

  useEffect(() => {
    isItStreaming(symbol, streamId);
    const interval = setInterval(() => {
      isItStreaming(symbol, streamId);
    }, 1000);
    setCheckInterval(interval);
    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <>
      {
        streaming === 'on' ? (
          <span title={`${symbol} Streaming.`} className="animate-pulse text-discord-red">
            <IconHeart/>
          </span>
        ) : streaming === 'pulse' ? (
          <span title={`${symbol} Stream Sleeping.`} className="animate-pulse text-discord-red">
            <IconHeartPulse/>
          </span>
        ) : (
          <span title={`${symbol} Not Streaming.`} className="text-gray-500">
            <IconHeart/>
          </span>
        )
      }
    </>
  );
}
