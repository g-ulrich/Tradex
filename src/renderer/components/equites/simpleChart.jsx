import React, {useState, useEffect, useRef} from 'react';
import {chartColors, seriesColors,
  CHART_THEMES, defaultChartOptions,
  defaultSimpleChartOptions} from '../lightweightcharts/options';
import {Chart, AreaSeries} from "lightweight-charts-react-wrapper";
import {IconEye, IconEyeSlash} from "../../api/Icons";
import { theme } from '../../../../tailwind.config';
import {currentESTTime} from '../../tools/util';


export default function SimpleChart({title, watermarkText, seriesData}) {
  const [chartWidth, setChartWidth] = useState(null);
  const series = useRef(null);

  const containerRef = useRef(null);

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


    return (
      <>
        <div ref={containerRef} className="w-full">
          {chartWidth !== null && containerRef.current !== null && typeof seriesData !== 'undefined' ? (
            <div className="h-[160px] py-2 rounded bg-discord-darkestGray w-full">
              <h3 className="text-gray-500 px-2 absolute z-[999]">{title}</h3>
                <span className="float-right px-2 text-gray-500">{currentESTTime()}</span>
              <Chart width={chartWidth} height={150}
                  {...CHART_THEMES.SimpleChart}
                  watermark={{
                    visible: true,
                    fontSize: 50,
                    horzAlign: 'center',
                    vertAlign: 'center',
                    color: chartColors.white,
                    text: watermarkText,
                    }}>
                  <AreaSeries data={seriesData}
                    topColor={seriesData[0].value <= seriesData[seriesData.length -1].value ? seriesColors.green.top : seriesColors.red.top}
                    bottomColor={seriesData[0].value <= seriesData[seriesData.length -1].value ? seriesColors.green.bottom : seriesColors.red.bottom}
                    lineColor={seriesData[0].value <= seriesData[seriesData.length -1].value ? seriesColors.green.line : seriesColors.red.line}
                    lineWidth={.5}
                    reactive={true}
                    ref={series}/>
              </Chart>

            </div>
          ) : (

            <div className="h-[150px] p-2 text-center rounded bg-discord-darkestGray w-full">
              Loading...
            </div>
          )
          }

        </div>
      </>
    );
        }
