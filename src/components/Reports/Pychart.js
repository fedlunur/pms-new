import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import DataService from "../DataServices";
import { chartColors } from "./ColorsUtil";

import { Button } from "primereact/button";

import { Dropdown } from "primereact/dropdown";
import { colors } from "@mui/material";
import { constrainPoint } from "@fullcalendar/core/internal";

export default function PieChartDemo() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const documentStyle = getComputedStyle(document.documentElement);
  const [uniqueActivities, setUniqueActivities] = useState([]);

  const { allprojects, allactivities, alltasks } = DataService();

  // Create an array to hold the colors
  const backgroundColors = chartColors.map((variable) =>
    documentStyle.getPropertyValue(variable).trim()
  );

  const handleChange = (event) => {
    setSelectedProject(event.value);
  };

  const searchbyproject = () => {
    if (selectedProject) {
      const filteredActivities = allactivities.filter(
        (activity) => activity.project_name === selectedProject
      );

      const tasksPerActivity = filteredActivities.map((activity) => {
        const count = alltasks.filter(
          (task) => task.activity === activity.id
        ).length;
        return count;
      });

      const data = {
        labels: filteredActivities.map((activity) => activity.list_title),
        datasets: [
          {
            data: tasksPerActivity,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors,
          },
        ],
      };

      setUniqueActivities(filteredActivities);
      setChartData(data);
    }
  };

  useEffect(() => {
    if (allprojects.length > 0) {
      const formattedProjects = allprojects.map((project) => ({
        label: project.project_name,
        value: project.id,
      }));
      setProjectsList(formattedProjects);
    }

    if (allactivities.length > 0 && alltasks.length > 0 && !selectedProject) {
      const activitiesUnique = allactivities.filter(
        (activity, index, self) =>
          self.findIndex(
            (a) =>
              a.list_title.toLowerCase() === activity.list_title.toLowerCase()
          ) === index
      );
      const tasksPerActivity = activitiesUnique.map((activity) => {
        const count = alltasks.filter(
          (task) => task.activity === activity.id
        ).length;
        return count;
      });

      const data = {
        labels: activitiesUnique.map((activity) => activity.list_title),
        datasets: [
          {
            data: tasksPerActivity,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors,
          },
        ],
      };

      setUniqueActivities(activitiesUnique);
      setChartData(data);
    }
  }, [allprojects, allactivities, alltasks, selectedProject]);

  return (
    <div className="" style={{ height: 421 }}>
      <div className="flex justify-between p-2 items-center">
        <h1 className="text-base font-semibold">Project Report</h1>
        <div
          className="dropdown-search-container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: 10,
          }}
        >
          <Dropdown
            // className="font-bold"
            value={selectedProject}
            options={projectsList}
            onChange={handleChange}
            filter
            showClear={true}
            placeholder="Select Project"
            className="border text-xs py-1 px-2 rounded-md w-[100px]"
          />
          {/* <Select
            placeholder="Select a person"
            optionFilterProp="label"
            onChange={handleChange}
            options={projectsList}
            value={selectedProject}
          /> */}
          <Button
            icon="pi pi-search"
            size={18}
            onClick={searchbyproject}
            aria-label="Search"
            className="py-1 px-2 rounded-md border text-sm outline-none h-[45px] w-[45px]"
          />
        </div>
      </div>
      <hr />
      <br></br>
      <br></br>
      <div className='flex flex-1  w-full  items-center justify-center'>
        <Chart
          type="pie"
          data={chartData}
          options={chartOptions}
          className="w-full h-full "
        />
      </div>
    </div>
  );
}
