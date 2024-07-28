import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const data = [
  { label: "On Progress", value: 500 },
  { label: "Completed", value: 300 },
  { label: "Suspended", value: 200 },
];

export default function PieGraph() {
  return (
    <div className="bg-white h-full flex items-center justify-center p-2">
      <div className="w-full h-full">
        <PieChart
          series={[
            {
              paddingAngle: 5,
              innerRadius: 60,
              outerRadius: 80,
              data,
            },
          ]}
          margin={{ right: 5 }}
          width={200} // Make the width dynamic if needed
          height={400} // Make the height dynamic if needed
          slotProps={{
            legend: {
              labelStyle: {
                fontSize: 12,
              },
              itemMarkWidth: 20,
              itemMarkHeight: 4,
              direction: "column",
              position: { vertical: "bottom", horizontal: "left" },
              padding: 0,
            },
          }}
        />
      </div>
    </div>
  );
}
