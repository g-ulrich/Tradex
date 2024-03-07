import { useState, useEffect } from 'react';

export default function ResizeChartWidth(containerRef, initialWidth) {
  const [chartWidth, setChartWidth] = useState(initialWidth);

  useEffect(() => {
     const resizeWidth = () => {
       if (containerRef.current) {
         setChartWidth(containerRef.current.clientWidth-3);
       }
     };
     resizeWidth();
     window.addEventListener("resize", resizeWidth);

     return () => {
       window.removeEventListener("resize", resizeWidth);
     };
  }, []);

  return [chartWidth];
 }
