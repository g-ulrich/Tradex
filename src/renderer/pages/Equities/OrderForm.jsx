import React, {useState, useEffect} from 'react';
import {
  formatVolume,
  getMarketOpenStatus
 } from '../../components/lightweightcharts/util';
 import {
  isSubStr
 } from '../../tools/util';
 import {
  IconAngleR,
  IconAngleL,
  IconOn,
  IconOff,
} from '../../api/Icons';
import IsStreaming from '../../pages/Equities/isStreaming';

export default function OrderForm({symbol, accountID, positions}) {
  const [symbolDetails, setSymbolDetails] = useState(null);
  const [streamQuote, setStreamQuote] = useState(null);
  const [quote, setQuote] = useState(null);
  const streamId = "eq_";

  const [simple, setSimple] = useState(true);
  const [position, setPosition] = useState(null);

  const [action, setAction] = useState('buy');
  const [quantity, setQuantity] = useState('5');
  const [orderType, setOrderType] = useState('limit');
  const [price, setPrice] = useState(null);
  const durations = ['Day' , 'Day+', 'GTC', 'GTC+', 'GTD', 'GTD+', 'IOC', 'FOK', 'OPG', 'CLO', '1 min', '3 min', '5 min'];
  const [duration, setDuration] = useState('Day+');
  const routes = ['Intelligent', 'AMEX', 'ARCX', 'BATS', 'BYX', 'CSFB', 'EDGA', 'IEX', 'POV-ALGO', 'TWAP-ALGO', 'VWAP-ALGO', 'SweepPI-ALGO', 'Sweep-ALGO', 'NQBX', 'NSDQ', 'NYSE'];
  const [route, setRoute] = useState('Intelligent');

  useEffect(() => {
    if (symbol !== null) {
      window.ts.marketData.streamQuotes(setStreamQuote, streamId, symbol.toUpperCase());
      window.ts.marketData.setSymbolDetails(setSymbolDetails, symbol);
    }
    return () => {
      if (symbol !== null) {
        window.ts.marketData.killAllStreamsById(streamId);
      }
    }
  }, []);

  useEffect(() => {
    if (symbol !== null) {
      window.ts.marketData.killAllStreamsById(streamId);
      window.ts.marketData.streamQuotes(setStreamQuote, streamId, symbol.toUpperCase());
      window.ts.marketData.setSymbolDetails(setSymbolDetails, symbol);
    }
  }, [symbol]);

  useEffect(() => {
    if (streamQuote !== null) {
      setQuote({
        ...quote,
        ...streamQuote
      });
    }
  }, [streamQuote]);


  useEffect(() => {
    if (quote !== null) {
      setPrice(quote.Last);
    }
  }, [quote]);

  const handleQuantity = (val) => {
    var val = parseInt(val) <= 0 ? 0 : val.toString().toLowerCase() === 'nan' ? 0 : val;
    setQuantity(val);
  }

  const handleAction = (txt) => {
    if (txt.toLowerCase() === 'buy' || txt.toLowerCase() === 'sell') {
      setAction(txt);
      const status = getMarketOpenStatus();
      const payLoad = window.ts.order._simple(
        accountID,
        status === 'Reg' ? "Market" : "Limit", // ordertype
        quantity,
        quote?.Symbol,
        status === 'Reg' ? "DAY" : "DYP",
        txt.toUpperCase()
      );
      if (status === 'Reg'){
        window.ts.order.placeOrder(payLoad);
      } else {
        const lp =  txt.toUpperCase() === 'BUY' ? quote.Ask : txt.toUpperCase() === 'SELL' ? quote.Bid : quote.Last;
        window.ts.order.placeOrder({
          ...payLoad,
          LimitPrice: lp.toString(),
        });
      }
    }
  }

  useEffect(() => {
    if (positions && positions !== null && quote !== null) {
      positions.forEach((p)=>{
        if (p.Symbol === quote.Symbol){
          setPosition(p);
        }
      });
    }
  }, [positions]);


  return (
    <>
      <div className="   rounded bg-discord-darkestGray text-gray-500 border border-discord-black">


          {
            quote !== null ? (
            <>

            <div className="row p-2 m-0">
              {/* <div className="col-12 p-0 m-0">
                <label class="text-right relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" onChange={()=>{setSimple(!simple)}} class="sr-only peer" />
                  <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span class="ms-3 text-sm font-medium text-gray-500">{simple ? 'Simple' : 'Complex'} Order</span>
                </label>

                <div className={`float-right text-lg`}>
                  <IsStreaming symbol={symbol} streamId={streamId}/>
                </div>
              </div> */}

              <div className="col-12 p-0 m-0 mb-2">
              <div className={`float-right text-lg`}>
                  <IsStreaming symbol={symbol} streamId={streamId}/>
                </div>
                <div>
                  <span className="text-lg text-white mr-2">
                    {
                      quote?.Symbol ?
                      quote.Symbol :
                      symbol
                    }
                  </span>
                  {
                    quote?.MarketFlagsDisplay ?
                    (<span className="text-lg text-gray-500">{quote?.MarketFlagsDisplay}{symbolDetails !== null ? ` ${symbolDetails[0]?.Exchange}` : '' }</span>) :
                    (<></>)
                  }
                </div>

                {
                  quote !== null ? (
                  <>
                    {/* <span className="text-lg text-white">{parseFloat(quote.Last).toFixed(3)}</span> */}
                    <span className={`text-lg ${parseFloat(quote.NetChange) >= 0 ? 'text-discord-softGreen' : 'text-discord-softBlurple'}`}>
                      <span className="text-white mr-2">{parseFloat(quote.Last).toFixed(3)}</span>
                      {parseFloat(quote.NetChange).toFixed(3)}
                      {parseFloat(quote.NetChange) >= 0 ? ' ▲ ' : ' ▼ '}
                      {parseFloat(quote.NetChangePct).toFixed(3)}%
                    </span>
                  </>
                  ) : (<></>)
                }
              </div>
              {
                simple ? (
                  <div className="row p-0 m-0">
                    {/* simple Quantity */}
                    <div className="col-6 px-1 text-lg text-white mb-2">
                      Quantity
                    </div>
                    <div className="col-6  text-lg">
                      <div className="row rounded">
                        <span onClick={()=>{handleQuantity(parseInt(quantity)-1)}} className={`col-2 p-0 text-white cursor-pointer rounded text-center active:bg-discord-darkGray`}><IconAngleL/></span>
                        <input type="text" value={quantity} onChange={(e)=>{handleQuantity(parseInt(e.target.value))}}
                        className="col-8 outline-none text-white text-center rounded bg-discord-darkGray"/>
                        <span onClick={()=>{handleQuantity(parseInt(quantity)+1)}} className={`col-2 p-0 text-white cursor-pointer rounded text-center  active:bg-discord-darkGray`}><IconAngleR/></span>
                      </div>
                    </div>

                  </div>
                ) : (
                  <></>
                )
              }
              <div className={`${position?.Symbol ? 'col-6 pr-4' : 'col-12'} text-lg`}>
              <div onClick={() => {handleAction('buy')}} className="row cursor-pointer bg-discord-green hover:bg-discord-softGreen active:bg-discord-green border-2 border-discord-green hover:border-discord-softGreen active:border-discord-green text-white rounded">
                <div className={`col-12 px-1 ${position?.Symbol ? 'text-left' : 'text-center'}`}>
                  Buy ({quantity}) {
                        quote !== null ?
                        `@ ${parseFloat(quote.Ask).toFixed(3)}` : ''
                    }
                </div>
                <div className={`col-6 ${simple ? 'hidden' : ''} p-1 rounded-b w-full text-left bg-discord-darkestGray`}>
                  <div className={`text-lg`}>
                    {
                        quote !== null ?
                        parseFloat(quote.Ask).toFixed(3) : '0'
                    }
                  </div>
                  <span className={` text-gray-400 mr-2`}>Size</span>
                  <span>
                    {
                        quote !== null ?
                        formatVolume(parseInt(quote.AskSize)) : '0'
                    }
                  </span>
                </div>
              </div>
              </div>
              <div className={`${position?.Symbol ? '' : 'hidden'} col-6 text-lg`}>
                <div onClick={() => {handleAction('sell')}}
                className="row cursor-pointer bg-discord-blurple hover:bg-discord-softBlurple active:bg-discord-blurple border-2 border-discord-blurple hover:border-discord-softBlurple active:border-discord-blurple text-white rounded">
                  <div className="col-12 px-1 text-left">
                        Sell ({quantity}) {
                        quote !== null ?
                        `@ ${parseFloat(quote.Bid).toFixed(3)}` : ''
                        }
                  </div>
                  <div className={`col-6 ${simple ? 'hidden' : ''} p-1 rounded-b w-full text-left bg-discord-darkestGray`}>
                    <div className="text-lg">
                    {
                        quote !== null ?
                        parseFloat(quote.Bid).toFixed(3) : '0'
                    }
                    </div>
                    <span className="text-gray-400 mr-2">Size</span>
                    <span>
                    {
                        quote !== null ?
                        formatVolume(parseInt(quote.BidSize)) : '0'
                    }
                    </span>
                  </div>
                </div>
              </div>
              {/* Simple order form */}

              {/* complex Order form */}
              {
                action !== null && !simple ? (
                  <div className="row p-0 m-0 pt-2 mt-1">
                    {/* Action */}
                    <div className="col-6 px-1 text-lg text-white mb-2">
                      Action
                    </div>
                    <div className="col-6 text-lg">
                      <div className="row rounded bg-discord-darkGray p-0">
                        <button  onClick={() => {handleAction('sell')}} className={`col-6 ${action === 'sell' ? 'bg-discord-softBlurple text-white' : ''} rounded  cursor-pointer rounded-l py-0 px-2 text-center`}>Sell</button>
                        <button  onClick={() => {handleAction('buy')}} className={`col-6 ${action === 'buy' ? 'bg-discord-softBlurple text-white' : ''} rounded  cursor-pointer rounded-r py-0 px-2 text-center`}>Buy</button>
                      </div>
                    </div>
                    {/* complex Quantity */}
                    <div className="col-6 px-1 text-lg text-white mb-2">
                      Quantity
                    </div>
                    <div className="col-6  text-lg">
                      <div className="row rounded">
                        <span onClick={()=>{handleQuantity(parseInt(quantity)-1)}} className={`col-2 p-0 text-white cursor-pointer rounded text-center active:bg-discord-darkGray`}><IconAngleL/></span>
                        <input type="text" value={quantity} onChange={(e)=>{handleQuantity(parseInt(e.target.value))}}
                        className="col-8 outline-none text-white text-center rounded bg-discord-darkGray"/>
                        <span onClick={()=>{handleQuantity(parseInt(quantity)+1)}} className={`col-2 p-0 text-white cursor-pointer rounded text-center  active:bg-discord-darkGray`}><IconAngleR/></span>
                      </div>
                    </div>
                  {/* Order Type */}
                  <div className="col-6 px-1 text-lg text-white mb-2">
                      Type
                    </div>
                    <div className="col-6 text-lg text-white">
                      <div className="row rounded">
                      <select onChange={(e)=>{setOrderType(e.target.value)}} className="outline-none focus:border-none active:border-none border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
                        <option>Limit</option>
                        <option>Market</option>
                        <option>Stop Market</option>
                        <option>Stop Limit</option>
                        <option>Trailing Stop</option>
                        <option>Trailing Stop %</option>
                      </select>
                      </div>
                    </div>

                  {/* Pricing */}
                  <div className={`${orderType === 'Market' ? 'hidden' : ''} col-6 px-1 text-lg text-white mb-1`}>
                      Price
                    </div>
                    <div className={`${orderType === 'Market' ? 'hidden' : ''} col-6 px-3 text-lg text-white`}>
                      <div className="row rounded">
                        <span onClick={()=>{handleQuantity(parseInt(quantity)-1)}} className={`col-2 p-0 text-white cursor-pointer rounded text-center active:bg-discord-darkGray`}><IconAngleL/></span>
                        <input type="text" value={quantity} onChange={(e)=>{handleQuantity(parseInt(e.target.value))}}
                        className="col-8 outline-none text-white text-center rounded bg-discord-darkGray"/>
                        <span onClick={()=>{handleQuantity(parseInt(quantity)+1)}} className={`col-2 p-0 text-white cursor-pointer rounded text-center  active:bg-discord-darkGray`}><IconAngleR/></span>
                      </div>
                    </div>

                  {/* Duration */}
                  <div className={`col-6 px-1 text-lg text-white mb-2`}>
                      Duration
                    </div>
                  <div className={`col-6 text-lg text-white`}>
                    <div className="row rounded">
                      <select onChange={(e)=>{setDuration(e.target.value)}} className=" outline-none focus:border-none active:border-none border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
                        {
                          durations.map((item, index) => (
                            <option key={index}>{item}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  {/* Routing */}
                  <div className={`col-6 px-1 text-lg text-white mb-2`}>
                      Route
                  </div>
                  <div className={`col-6 text-lg text-white`}>
                    <div className="row rounded">
                      <select onChange={(e)=>{setRoute(e.target.value)}} className=" outline-none focus:border-none active:border-none border border-none cursor-pointer rounded bg-discord-darkerGray hover:bg-discord-darkGray px-2 py-[3px]">
                        {
                          routes.map((item, index) => (
                            <option key={index}>{item}</option>
                          ))
                        }
                      </select>

                    </div>
                  </div>
                  <button className={`mt-2 col-12 text-lg text-center py-2 user-select-none text-white rounded ${action === 'sell' ? 'bg-discord-blurple hover:bg-discord-softBlurple active:bg-discord-blurple' : 'bg-discord-softGreen hover:bg-discord-green active:bg-discord-softGreen'} cursor-pointer`}>
                    Execute <b>{action}</b> Order
                  </button>

                  </div>
                ) : (<></>)
              }

            </div>
            </>
          ) : (
            <>
              <div className="text-center">Loading {quote === null ? 'Quote' : symbolDetails === null ? 'Symbol Details' : ''} Data...</div>
            </>
          )
        }
    </div>
    </>
  );
}
