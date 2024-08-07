import { Progress } from "antd";
import React, { useState, useEffect } from "react";
import DataService from "./DataServices";

const ProjectDashboardCard = () => {
  const {
    allprojects,
    allactivities,
    alltasks,
  } = DataService();

  const twoColors = {
    "0%": "#3b82f6",
    "100%": "#3f51b5",
  };
  const [tasksForProject, setTasksForProject] = useState([]);

  const fetchTasksForProject = (projectId) => {
    return alltasks.filter((task) =>
      allactivities.some(
        (activity) =>
          activity.id === task.activity && activity.project_name === projectId
      )
    );
  };

  useEffect(() => {
    if (allprojects.length > 0 && alltasks.length > 0 && allactivities.length > 0) {
      const tasksByProject = allprojects.map((project) => ({
        projectId: project.id,
        tasks: fetchTasksForProject(project.id),
      }));
      setTasksForProject(tasksByProject);
    }
  }, [allprojects, alltasks, allactivities]);

  const calculateProgress = (projectId) => {
    const projectTasks = tasksForProject.find(
      (p) => p.projectId === projectId
    )?.tasks;

    const doneTasks = projectTasks?.filter(
      (task) =>
        allactivities.find(
          (activity) => activity.id === task.activity && activity.list_title === "Done"
        )
    ).length;

    return projectTasks?.length > 0
      ? Math.ceil((doneTasks / projectTasks.length) * 100)
      : 0;
  };

  return (
    <div className="py-2 px-3 bg-white h-[400px] rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-base text-gray-900">Projects</h1>
        <button className="text-blue-500 hover:underline text-xs">
          See More
        </button>
      </div>
      <hr />
      {allprojects.map((project, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-300"
        >
          <div>
            <h1 className="font-regular">{project.project_name}</h1>
            <span className="font-light text-xs text-slate-500">
              {project.start_date} - {project.end_date}
            </span>
          </div>
          <Progress
            type="circle"
            percent={calculateProgress(project.id)}
            strokeColor={twoColors}
            size={40}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectDashboardCard;