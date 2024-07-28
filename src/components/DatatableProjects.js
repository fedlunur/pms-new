import React, { useEffect, useState } from "react";
import Layout from "../views/Layout";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  Card,
  Col,
  Divider,
  Progress,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { FaEye } from "react-icons/fa";

function DatatableProjects({
  projects,
  teammembers,
  users,
  activities,
  tasks,
}) {
  const history = useHistory();
  const [tasksForProject, setTasksForProject] = useState([]);

  const teammemberTemplate = (rowData) => {
    const members = teammembers.filter(
      (member) => member.team.id === rowData.id
    );
  
    return members.length > 0 ? (
      <Avatar.Group
        max={{
          count: 2,
          style: {
            color: "#3b82f6",
            backgroundColor: "#e0f2ff",
          },
        }}
      >
        {members.map((member) => (
          <Tooltip title={member.user.first_name} key={member.id}>
            <Avatar
              style={{
                backgroundColor: "#e0f2ff",
                color: "#3b82f6",
                cursor: "pointer",
              }}
              onClick={() => console.log(member.id)}
            >
              {member.user.first_name.charAt(0)}
            </Avatar>
          </Tooltip>
        ))}
      </Avatar.Group>
    ) : (
      <span>No Team Members</span>
    );
  };
  
  const totalTaskTemplate = ( rowData ) => {
  
    console.log("For the project  ======> ",rowData)
      // Filter activities based on project association (assuming 'project_id' is the property on activity)
      const activityList = activities.filter((activity) => activity.project_name === rowData.id);
    console.log("The actvities List => ",activityList)
      // Filter tasks based on activity association (assuming 'activity_id' is the property on task)
      const tasklist= tasks.filter((task) => activityList.some((activity) => activity.id === task.activity));
      console.log("The taks  List => ",tasklist)
      // Calculate the total number of tasks (assuming tasks is an array)
      const taskCount = tasklist.length;
    
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          {taskCount}  {/* Display the total task count */}
        </div>
      );
    };

  const fetchTasksForProject = (projectId) => {
    return tasks.filter((task) =>
      activities.some(
        (activity) =>
          activity.id === task.activity && activity.project_name === projectId
      )
    );
  };

  useEffect(() => {
    const tasksByProject = projects.map((project) => ({
      projectId: project.id,
      tasks: fetchTasksForProject(project.id),
    }));
    setTasksForProject(tasksByProject);
  }, [projects, tasks, activities]);

  console.log(tasksForProject, "tasksForProject");

  const calculateProgress = (projectId) => {
    const projectTasks = tasksForProject.find(
      (p) => p.projectId === projectId
    )?.tasks;

    const doneTasks = projectTasks?.filter(
      (task) =>
        activities.find(
          (activity) => activity.id === task.activity && activity.list_title === "Done"
        )
    ).length;

    return projectTasks?.length > 0
      ? Math.ceil((doneTasks / projectTasks.length) * 100)
      : 0;
  };

  return (
    <div>
      <section className="">
        <div className="bg-transparent">
          <div className="bg-transparent border-transparent">
            <h1 className="font-semibold text-lg text-gray-800 mb-4">
              Projects
            </h1>
            <Row gutter={10}>
              {projects.map((project) => (
                <Col span={8} key={project.id}>
                  <Card>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h1 className="font-semibold text-lg text-gray-800">
                          {project.project_name}
                        </h1>
                        <div className="flex gap-1">
                          <span className="text-xs text-gray-500">
                            {totalTaskTemplate(project)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Tasks Total
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-100 w-6 h-6 flex items-center justify-center cursor-pointer rounded-full">
                        <FaEye
                          size={18}
                          className="text-blue-600"
                          onClick={() =>
                            history.push("/activityboardlist", {
                              projects: project,
                              users: users,
                              teammembers: teammembers,
                              activities: activities,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Divider />
                    <span className="text-xs text-gray-500">Progress</span>
                    <Progress
                      percent={calculateProgress(project.id)}
                      strokeColor={{ "0%": "#3b82f6", "100%": "#3f51b5" }}
                    />
                    <Typography.Paragraph ellipsis={{ rows: 1 }}>
                      {project.description}
                    </Typography.Paragraph>
                    <div className="flex justify-between mt-4">
                      <div>
                        <h1 className="text-gray-700">Created at:</h1>
                        <p className="font-semibold text-gray-900">
                          {project.start_date}
                        </p>
                      </div>
                      <div>
                        <h1 className="text-gray-700">Deadline:</h1>
                        <p className="font-semibold text-gray-900">
                          {project.end_date}
                        </p>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center">
                      {teammemberTemplate(project)}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DatatableProjects;
