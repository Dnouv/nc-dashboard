import { useState } from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import {
  Legend,
  LegendLinear,
  LegendQuantile,
  LegendOrdinal,
  LegendSize,
  LegendThreshold,
  LegendItem,
  LegendLabel,
} from "@visx/legend";
import {
  scaleLinear,
  scaleOrdinal,
  scaleThreshold,
  scaleQuantile,
} from "@visx/scale";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import DataUsageIcon from "@mui/icons-material/DataUsage";

export default function Home({ pieData }) {
  const [active, setActive] = useState(null);
  const width = 400;
  const half = width / 2;

  const stringToColour = (stringInput: string) => {
    let stringUniqueHash = [...stringInput].reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
  };
  return (
    <Card>
      <CardContent style={{ display: "flex" }}>
        <svg width={width} height={width}>
          <Group top={half} left={half}>
            <Pie
              data={pieData}
              pieValue={(data) => data.data["7 Days Volume"]}
              outerRadius={half}
              innerRadius={(data) => {
                const size = 50;
                return half - size;
              }}
              padAngle={0.01}
            >
              {(pie) => {
                return pie.arcs.map((arc) => {
                  const color = stringToColour(arc.data.data.Project);
                  return (
                    <g
                      key={arc.data.data.Project}
                      onMouseEnter={() => setActive(arc.data.data)}
                      onMouseLeave={() => setActive(null)}
                    >
                      <path d={pie.path(arc) || undefined} fill={color}></path>
                    </g>
                  );
                });
              }}
            </Pie>

            {active ? (
              <>
                <Text textAnchor="middle" fill="#fff" fontSize={40} dy={-20}>
                  {`$${Math.floor(active["7 Days Volume"])}`}
                </Text>

                <Text textAnchor="middle" fill={"white"} fontSize={20} dy={20}>
                  {`${active["Project"]}: 7 Days Volume `}
                </Text>
              </>
            ) : (
              <>
                <Text textAnchor="middle" fill="#aaa" fontSize={20} dy={20}>
                  {`Hover to view`}
                </Text>
              </>
            )}
          </Group>
        </svg>
        <List dense style={{ overflow: "auto", maxHeight: "400px" }}>
          {pieData.map((idat) => {
            return (
              <ListItem key={idat.data.Rank}>
                <ListItemAvatar>
                  {
                    <DataUsageIcon
                      style={{ color: stringToColour(idat.data.Project) }}
                    />
                  }
                </ListItemAvatar>
                <ListItemText>{idat.data.Project}</ListItemText>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
