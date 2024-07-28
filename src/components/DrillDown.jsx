import React, { useState, useEffect } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, theme } from "antd";
import { GrInProgress, GrProjects } from "react-icons/gr";
import {
  FaTasks,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaListAlt,
  FaClock,
} from "react-icons/fa";
import DataService from "./DataServices";

const DrillDown = () => {
  const [tasks, setTasks] = useState([]);
  const { allprojects, alltasks, activities_by_project, tasksbyactivity } =
    DataService();

  useEffect(() => {
    setTasks(alltasks);
  }, [alltasks]);

  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 0,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const iconStyle = "mr-2 text-gray-800"; 

  const calculatePercentage = (activity, tasks, numberOfTasks) => {
    const activityTasks = tasks.filter(
      (task) => task.activity === activity.id && activity.list_title === "Done"
    );
    const totalTasks = activityTasks.length;

    return numberOfTasks > 0
      ? ((totalTasks / numberOfTasks) * 100).toFixed(2)
      : 0;
  };

  function getRemainingTimeDetails(dueDate) {
    if (!dueDate) return { text: "None", color: "text-red-500" };

    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: "Passed", color: "text-red-400 bg-red-50" };
    if (days === 0)
      return { text: "Due today", color: "text-orange-400 bg-orange-50" };
    if (days === 1)
      return {
        text: "1 day left",
        color: "text-orange-400 bg-orange-50",
      };
    if (days === 2)
      return {
        text: "2 days left",
        color: "text-orange-400 bg-orange-50",
      };

    return {
      text: `${days} days left`,
      color: "text-gray-400 bg-gray-50",
    };
  }

  return (
    <div>
      <Collapse
        bordered={false}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{
          background: token.colorBgContainer,
          marginBottom: "1rem",
        }}
      >
        <Collapse.Panel
          header={<div className ="flex items-center gap-2"><GrProjects />Project Details</div>}
          className="text-gray-800 text-base"
        >
          {allprojects.map((project) => {
            const activities = activities_by_project(project);
            const projectTasks = tasks.filter((task) =>
              activities.some((activity) => activity.id === task.activity)
            );
            const numberOfTasks = projectTasks.length;
            const startingDate = project.start_date || "Unknown";

            return (
              <Collapse
                key={project.id}
                bordered={false}
                expandIconPosition="end"
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                style={{
                  background: token.colorBgContainer,
                  marginBottom: "1rem",
                }}
              >
                <Collapse.Panel
                  header={`${project.project_name} `}
                  style={panelStyle}
                  className="text-gray-800 text-base"
                >
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaTasks />
                      <p>Tasks: {alltasks.length}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaCalendarAlt />
                      <p>Starting Date: {project.start_date}</p>
                    </div>
                  </div>
                  <Collapse
                    bordered={false}
                    expandIconPosition="end"
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    style={{
                      background: token.colorBgContainer,
                      marginBottom: "1rem",
                    }}
                  >
                    {activities.map((activity) => {
                      let doneTasks = [];

                      if (activity.list_title === "Done") {
                        doneTasks = tasksbyactivity(activity.id);
                      }

                      return (
                        <Collapse.Panel
                          key={activity.id}
                          header={activity.list_title}
                          style={panelStyle}
                        >
                          <ul className="p-0 m-0">
                            {projectTasks
                              .filter((task) => task.activity === activity.id)
                              .map((task) => (
                                <li
                                  key={task.id}
                                  className="text-gray-800 text-sm mb-2"
                                >
                                  <Collapse
                                    bordered={false}
                                    expandIconPosition="end"
                                    expandIcon={({ isActive }) => (
                                      <CaretRightOutlined
                                        rotate={isActive ? 90 : 0}
                                      />
                                    )}
                                    style={{
                                      background: token.colorBgContainer,
                                      marginBottom: "1rem",
                                    }}
                                  >
                                    <Collapse.Panel
                                      header={task.task_name}
                                      style={panelStyle}
                                    >
                                      <div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <GrInProgress />
                                          <p>Progress: {doneTasks.length}%</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <FaClock />
                                          <p>
                                            {
                                              getRemainingTimeDetails(
                                                task.due_date
                                              ).text
                                            }
                                          </p>
                                        </div>
                                      </div>
                                      {task.task_name}
                                    </Collapse.Panel>
                                  </Collapse>
                                </li>
                              ))}
                          </ul>
                        </Collapse.Panel>
                      );
                    })}
                  </Collapse>
                </Collapse.Panel>
              </Collapse>
            );
          })}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default DrillDown;
