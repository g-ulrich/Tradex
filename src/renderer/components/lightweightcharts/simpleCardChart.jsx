import React, {useState, useEffect, useRef} from 'react';
import {chartColors, seriesColors, CHART_THEMES, defaultChartOptions, defaultSimpleChartOptions} from './options';
import {Chart, AreaSeries} from "lightweight-charts-react-wrapper";
import {IconEye, IconEyeSlash} from "../Icons";
import { theme } from '../../../../tailwind.config';

export default function SimpleCardChart({title, watermarkText, seriesData}) {
  const [toggleView, setToggleView] = useState(false);
  const [chartWidth, setChartWidth] = useState(null);

  const containerRef = useRef(null);

  const watermark = (txt) => {
        return {
        visible: !toggleView,
        fontSize: 50,
        horzAlign: 'center',
        vertAlign: 'center',
        color: chartColors.white,
        text: txt,
        }
    };

    useEffect(() => {
      const resizeWidth = () => {
        if (containerRef.current) {
          setChartWidth(containerRef.current.clientWidth);
        }
      }
      resizeWidth();
      window.addEventListener('resize', resizeWidth);
      return () => {
        window.removeEventListener('resize', resizeWidth);
      }
    }, []);

    const toggleChartOptions = () => {
      return toggleView ?
      CHART_THEMES.defaultChart :
      CHART_THEMES.simpleChart;
    };

    return (
      <>
        <div ref={containerRef} className="w-full">
          {chartWidth !== null && containerRef.current !== null && typeof seriesData !== 'undefined' ? (
            <div className="h-[160px] py-2 rounded bg-discord-darkestGray w-full">
              <h3 className="text-gray-500 px-2 absolute z-[999]">
                <span onClick={()=>{setToggleView(!toggleView)}}
                className={`hidden px-2 mr-[4px] cursor-pointer bg-discord-darkGray rounded`}>{toggleView ? (<IconEye/>) : (<IconEyeSlash/>)}</span>
                {title}</h3>
              <Chart width={chartWidth} height={150}
                {...toggleChartOptions()}
                  watermark={watermark(watermarkText)}>
                  <AreaSeries data={seriesData}
                  topColor={seriesData[0].value <= seriesData[seriesData.length -1].value ? seriesColors.green.top : seriesColors.red.top}
                  bottomColor={seriesData[0].value <= seriesData[seriesData.length -1].value ? seriesColors.green.bottom : seriesColors.red.bottom}
                  lineColor={seriesData[0].value <= seriesData[seriesData.length -1].value ? seriesColors.green.line : seriesColors.red.line}
                  lineWidth={.5}/>
              </Chart>

            </div>
          ) : (

            <div className="h-[150px] p-2 text-center rounded border border-discord-black bg-discord-darkestGray w-full">
              Loading...
            </div>
          )
          }

        </div>
      </>
    );
        }
