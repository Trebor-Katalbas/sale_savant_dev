import { useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import React from "react";

const LineSalesChart = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveLine
      data={[{ id: "Total Sales", data }]}
      margin={{ top: 60, right: 30, bottom: 50, left: 70 }}
      theme={{
        grid: {
          line: {
            stroke: theme.palette.secondary[800],
            strokeWidth: 1,
          },
        },
        axis: {
          domain: {
            line: {
              stroke: theme.palette.secondary[200],
            },
          },
          legend: {
            text: {
              fill: theme.palette.secondary[100],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.secondary[100],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.secondary[100],
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.secondary[100],
          },
        },
        tooltip: {
          container: {
            background: theme.palette.primary[800],
            color: theme.palette.primary[300],
          },
        },
      }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
        useUTC: false,
        precision: "day",
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      curve="linear"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: "%b %d",
        tickValues: "every 1 day",
        orient: "bottom",
        legend: "Day",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        legend: "Total Sales",
        legendOffset: -45,
        legendPosition: "middle",
      }}
      colors={{ scheme: "category10" }}
      lineWidth={2}
      pointSize={10}
      pointColor={{ from: "color", modifiers: [] }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      enableGridX={false}
      enablePointLabel={true}
      enableCrosshair={true}
      useMesh={true}
      legends={[
        {
          anchor: "top",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: -30,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
        },
      ]}
    />
  );
};

export default LineSalesChart;
