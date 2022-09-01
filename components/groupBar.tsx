import React from "react";
import { Group } from "@visx/group";
import { BarGroup } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import cityTemperature, {
  CityTemperature,
} from "@visx/mock-data/lib/mocks/cityTemperature";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { timeParse, timeFormat } from "d3-time-format";
import { lightGreen } from "@mui/material/colors";

export type BarGroupProps = {
  gdata: any[];
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

type CityName = "New York" | "San Francisco" | "Austin";

const blue = "#aeeef8";
export const green = "#e5fd3d";
const purple = "#9caff6";
export const background = "#612efb";
export const red = "#ff0000";

const data = cityTemperature.slice(0, 6);
console.log("data", data);
const keys = Object.keys(data[0]).filter((d) => d !== "date") as CityName[];
console.log("data key", keys);


const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");

const preprocess = (gdata:any) => {
  console.log("gdata", gdata)
  let tempKey = new Set()
  let tempYear = new Set()

  gdata.forEach((element:any) => {
    tempKey.add(element.data.month.toString())
  });

  gdata.forEach((element:any) => {
    tempYear.add(element.data.year)
  });

  tempKey = Object.assign(Array.from(tempKey, v => ({month:v})))

  let preProcData:[] = []
  // preProcData = preProcData.shift()

  tempKey.forEach((eleKey:any) => {
    const similar = gdata.filter((e:any) => e.data.month == eleKey.month)
    let tempArr:[{}] = [{}]
    similar.forEach((element:any) => {
      tempArr.push({[element.data.year] : element.data.usd_volume.toString()})
    });
    tempArr = [Object.assign({}, ...tempArr, eleKey)]

    tempYear.forEach((yr:any) => {
      if ( ! Object.keys(tempArr[0]).includes(yr.toString())) {
        tempArr = [Object.assign({}, ...tempArr, {[yr]: 0})]
      }
    });
    Array.prototype.push.apply(preProcData, tempArr)
    
  })

  console.log("checking", preProcData)
  return {preProcData, tempYear}

}

export default function GroupBar({
  gdata,
  events = false,
  margin = defaultMargin,
}: BarGroupProps) {
  // bounds
  const width = 600;
  const height = 400;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  /////////// testing shift
  const {preProcData, tempYear} = preprocess(gdata)
  let finalKey: string[]
  finalKey = []

  tempYear.forEach(function(key:any){
    // do something with "this"
    finalKey.push(key)
});

  console.log("finalKey", finalKey)

  let empKey = ["2019", "2020", "2021", "2022"]

  const formatDate = (date: string) => format(parseDate(date) as Date);

  // accessors
  const getDate = (d:{month:string}) => d.month;
    console.log("check date domain", preProcData.map(getDate))
  // scales
  const dateScale = scaleBand<string>({
    domain: preProcData.map(getDate),
    padding: 0.3,
  });
  const cityScale = scaleBand<string>({
    domain: finalKey,
    padding: 0.1,
  });
  const tempScale = scaleLinear<number>({
    domain: [
      0,
      Math.max(
        ...preProcData.map((d) => Math.max(...finalKey.map((key) => Number(d[key]))))
      ),
    ],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: finalKey,
    range: [blue, green, purple, red],
  });

  ////////// end testing shift

  // update scale output dimensions
  dateScale.rangeRound([0, xMax]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);
  tempScale.range([yMax, 0]);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={background}
      />
      <Group top={margin.top} left={margin.left -10}>
        <BarGroup
          data={preProcData}
          keys={finalKey}
          height={yMax}
          x0={getDate}
          x0Scale={dateScale}
          x1Scale={cityScale}
          yScale={tempScale}
          color={colorScale}
        >
          {(barGroups) =>
            barGroups.map((barGroup) => (
              <Group
                key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                left={barGroup.x0 + 25}
              >
                {barGroup.bars.map((bar) => (
                  <rect
                    key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    rx={0}
                    onClick={() => {
                      if (!events) return;
                      const { key, value } = bar;
                      alert(JSON.stringify({ key, value }));
                    }}
                  />
                ))}
              </Group>
            ))
          }
        </BarGroup>
      </Group>
      <AxisBottom
        top={yMax + margin.top}
        left={25}
        // tickFormat={formatDate}
        scale={dateScale}
        stroke={green}
        tickStroke={green}
        tickLabelProps={() => ({
          fill: green,
          fontSize: 11,
          textAnchor: "middle",
        })}
      />
      <AxisLeft
        top={margin.top}
        left={margin.left + 25}
        //   scale={stageScale}
        scale={tempScale}
        stroke={green}
        hideZero
        hideTicks
        tickFormat={(cost:any) => cost/Math.pow(10, 9) + "B"}
      />
    </svg>
  );
}
