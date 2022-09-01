import React from "react";
import { Group } from "@visx/group";
import { BarGroup } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";

import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";

import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

interface InnerGraphData {
  month: number;
  usd_volume: number;
  year: number;
}

export type BarGroupProps = {
  gdata: [data: InnerGraphData];
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  width?: number;
  height?: number
};

const blue = "#aeeef8";
export const green = "#e5fd3d";
const purple = "#9caff6";
export const background = "#717171";
export const red = "#ff0000";

const defaultMargin = { top: 90, right: 0, bottom: 40, left: 60 };

const preprocess = (gdata: any) => {
  let tempKey = new Set();
  let tempYear = new Set();

  gdata.forEach((element: any) => {
    tempKey.add(element.data.month.toString());
  });

  gdata.forEach((element: any) => {
    tempYear.add(element.data.year);
  });

  tempKey = Object.assign(Array.from(tempKey, (v) => ({ month: v })));

  let preProcData: [] = [];

  tempKey.forEach((eleKey: any) => {
    const similar = gdata.filter((e: any) => e.data.month == eleKey.month);
    let tempArr: [{}] = [{}];
    similar.forEach((element: any) => {
      tempArr.push({ [element.data.year]: element.data.usd_volume.toString() });
    });
    tempArr = [Object.assign({}, ...tempArr, eleKey)];

    tempYear.forEach((yr: any) => {
      if (!Object.keys(tempArr[0]).includes(yr.toString())) {
        tempArr = [Object.assign({}, ...tempArr, { [yr]: 0 })];
      }
    });
    Array.prototype.push.apply(preProcData, tempArr);
  });

  return { preProcData, tempYear };
};

export default function GroupBar({
  gdata,
  width=500,
  height=400,
  events = false,
  margin = defaultMargin,
}: BarGroupProps) {
  // bounds
  // const width = 500;
  // const height = 400;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  /////////// testing shift
  const { preProcData, tempYear } = preprocess(gdata);
  let finalKey: string[];
  finalKey = [];

  tempYear.forEach(function (key: any) {
    // do something with "this"
    finalKey.push(key);
  });

  // accessors
  const getDate = (d: { month: string }) => d.month;

  // scales
  const dateScale = scaleBand<string>({
    domain: preProcData.map(getDate),
    padding: 0.1,
  });
  const cityScale = scaleBand<string>({
    domain: finalKey,
    padding: 0.1,
  });
  const tempScale = scaleLinear<number>({
    domain: [
      0,
      Math.max(
        ...preProcData.map((d) =>
          Math.max(...finalKey.map((key) => Number(d[key])))
        )
      ),
    ],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: finalKey,
    range: [blue, green, purple, red],
  });

  ////////// end testing shift
  const legendGlyphSize = 15;

  // update scale output dimensions
  dateScale.rangeRound([0, xMax]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);
  tempScale.range([yMax, 0]);

  return width < 10 ? null : (
    <Card style={{ background: background }}>
      <CardContent>
        <Box>
            <svg width={width} height={height}>

              <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={background}
              />

              <Group top={margin.top} left={margin.left}>
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
                        left={barGroup.x0}
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
                left={margin.left}
                scale={dateScale}
                stroke={green}
                tickStroke={green}
                label="Month"
                tickLabelProps={() => ({
                  fill: green,
                  fontSize: 11,
                  textAnchor: "middle",
                })}
              />
              <AxisLeft
                top={margin.top}
                left={margin.left}
                scale={tempScale}
                stroke={green}
                hideZero
                hideTicks
                hideAxisLine
                label="Total USD DEX Volume"
                tickFormat={(cost: any) => cost / Math.pow(10, 9) + "B"}
              />
            </svg>
        </Box>
        <Box>
          <LegendDemo title="Index">
            <LegendOrdinal scale={colorScale}>
              {(labels) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {labels.map((label, i) => (
                    <LegendItem
                      key={`legend-quantile-${i}`}
                      margin="0 5px"
                      onClick={() => {
                        if (events) alert(`clicked: ${JSON.stringify(label)}`);
                      }}
                    >
                      <svg width={legendGlyphSize} height={legendGlyphSize}>
                        <rect
                          fill={label.value}
                          width={legendGlyphSize}
                          height={legendGlyphSize}
                        />
                      </svg>
                      <LegendLabel align="left" margin="0 0 0 4px">
                        {label.text}
                      </LegendLabel>
                    </LegendItem>
                  ))}
                </div>
              )}
            </LegendOrdinal>
          </LegendDemo>
        </Box>
      </CardContent>
    </Card>
  );
}

function LegendDemo({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="legend">
      <div className="title">{title}</div>
      {children}
      <style jsx>{`
        .legend {
          line-height: 0.9em;
          color: #efefef;
          font-size: 10px;
          font-family: arial;
          padding: 10px 10px;
          float: left;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          margin: 5px 5px;
        }
        .title {
          font-size: 12px;
          margin-bottom: 10px;
          font-weight: 100;
        }
      `}</style>
    </div>
  );
}
