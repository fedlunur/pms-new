import { Progress } from "antd";
import React from "react";

const projectData = [
  { name: "Website Redesign", date: "June 1 - June 7", percentage: 85 },
  { name: "Mobile App Launch", date: "June 8 - June 14", percentage: 70 },
  { name: "Marketing Campaign", date: "June 15 - June 21", percentage: 60 },
  { name: "Backend Upgrade", date: "June 22 - June 28", percentage: 90 },
  { name: "UI/UX Improvements", date: "June 29 - July 5", percentage: 75 },
];

const ProjectDashboardCard = () => {
  const twoColors = {
    "0%": "#3b82f6",
    "100%": "#3f51b5",
  };

  return (
    <div className="py-2 px-3 bg-white h-[400px] rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-base text-gray-900">Projects</h1>
        <button className="text-blue-500 hover:underline text-xs">See More</button>
      </div>
      <hr />
      {projectData.map((project, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-300"
        >
          <div>
            <h1 className="font-regular">{project.name}</h1>
            <span className="font-light text-xs text-slate-500">{project.date}</span>
          </div>
          <Progress type="circle" percent={project.percentage} strokeColor={twoColors} size={40} />
        </div>
      ))}
    </div>
  );
};

export default ProjectDashboardCard;
