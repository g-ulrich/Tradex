import { useState, useEffect } from 'react';

export default function GetChartRange(chartRef, candles, candleKey) {
  const key = candleKey ? candleKey : 'close';
  const [timeScalerange, setTimeScaleRange] = useState();
  const [rangeById, setRangeById] = useState();
  const [isProfiting, setIsProfiting] = useState();

  const synchronizeChartRange = () => {
    const chartRange = chartRef.current.timeScale().getVisibleRange();
    if (chartRange && candles.length > 0){
      try{
        const from = candles.findIndex(
          (item) => item["time"] === chartRange.from
        );
        const to = candles.findIndex(
          (item) => item["time"] === chartRange.to
        );

        const idRange = {from: from, to: to};
        const profiting = candles[from][key] <= candles[to][key];
        setRangeById(prev=>idRange);
        setTimeScaleRange(prev=>chartRange);
        setIsProfiting(prev=>profiting);
      }catch(error){
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      timeScale.subscribeVisibleTimeRangeChange(synchronizeChartRange);
      return () => {
        timeScale.unsubscribeVisibleTimeRangeChange(synchronizeChartRange);
      };
    }
  }, [candles]);


  return [timeScalerange,rangeById,isProfiting];
 }
