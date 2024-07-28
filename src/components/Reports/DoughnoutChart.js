import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

function ProjectStatusChart({ finished, inProgress, pending }) {
  const data = {
    labels: ["Finished", "In Progress", "Pending"],
    datasets: [
      {
        data: [finished, inProgress, pending],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        hoverBackgroundColor: ["#66bb6a", "#ffb74d", "#e57373"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export default ProjectStatusChart;
