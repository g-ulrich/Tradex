import {isSubStr} from '../../../tools/util';
import {
  LineSeries,
} from "lightweight-charts-react-wrapper";
import {
  CHART_THEMES,
} from "../options";

export default function InsertChartStudies({selectedStudies}){
  return(
    <>
      {selectedStudies.map((obj, i) => (
        obj?.hidden ? (
          <></>
        ) : typeof obj?.data[0]?.value !== 'number' ? (

          isSubStr(obj?.name, 'getBollingerBands') ? (
            <>
            { ["upper", "middle", "lower"].map((keyName) => (
                <LineSeries
                  key={`${i}_keyName`}
                  lineWidth={keyName === 'middle' ? 1 : 1.5}
                  color={obj.color}
                  data={
                    obj?.data.map((item) => ({ time: item.time, value: item[keyName]}))
                  }
                  lineStyle={keyName === 'middle' ? CHART_THEMES.dottedLine.lineStyle : CHART_THEMES.nothingLine.lineStyle}
                />
              ))
            }
            </>
          ) : isSubStr(obj?.name, 'getIchimokucloud') ? (
            <>
              {/* "conversion", "base", "spanA", "spanB"*/}
              { ["spanA", "spanB"].map((keyName) => (
                  <LineSeries
                    key={`${i}_${keyName}`}
                    lineWidth={1.5}
                    color={obj.color}
                    data={
                      obj?.data.map((item) => ({ time: item.time, value: item[keyName]}))
                    }
                  />
                ))
              }
            </>
          ) : (
            ''
          )
        ) : (
          <LineSeries
            key={i}
            lineWidth={1}
            color={obj.color}
            data={obj.data}
          />
        )
      ))}
    </>
  );
}
