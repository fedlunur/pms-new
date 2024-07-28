import React, { useState, useEffect } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import Layout from "../views/Layout";
import { Collapse, Row, Col } from "antd";
import DataService from "./DataServices";

const ProjectDetails = () => {
  const { allprojects, alltasks, activities_by_project } = DataService();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(alltasks);
  }, [alltasks]);

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
      return { text: "1 day left", color: "text-orange-400 bg-orange-50" };
    if (days === 2)
      return { text: "2 days left", color: "text-orange-400 bg-orange-50" };

    return { text: `${days} days left`, color: "text-gray-400 bg-gray-50" };
  }

  function getPriority(priority) {
    if (priority === "0") {
      return { text: "Normal", color: "bg-orange-300 text-orange-500" };
    } else if (priority === "1") {
      return { text: "Low", color: "bg-green-300 text-green-500" };
    } else if (priority === "2") {
      return { text: "High", color: "bg-red-300 text-red-500" };
    } else {
      return { text: "None", color: "bg-gray-300 text-gray-500" };
    }
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Project Details</h1>
        <div className="py-2 px-4 mb-4 rounded-md border bg-gray-100">
          <Row className="font-semibold">
            <Col span={5}>
              <p>Project Name</p>
            </Col>
            <Col span={9}>
              <p>Project Description</p>
            </Col>
            <Col span={5}>
              <p>Starting Date</p>
            </Col>
            <Col span={5}>
              <p>End Date</p>
            </Col>
          </Row>
        </div>
        {allprojects.map((project) => {
          const activities = activities_by_project(project);
          const projectTasks = tasks.filter((task) =>
            activities.some((activity) => activity.id === task.activity)
          );
          return (
            <Collapse
              expandIconPosition="end"
              key={project.id}
              className="mb-2 bg-white"
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
            >
              <Collapse.Panel
                header={
                  <div className="text-start">
                    <Row>
                      <Col span={5}>
                        <p className="font-medium">{project.project_name}</p>
                      </Col>
                      <Col span={9}>
                        <p>{project.description}</p>
                      </Col>
                      <Col span={5}>
                        <p>{project.start_date}</p>
                      </Col>
                      <Col span={5}>
                        <p>{project.end_date}</p>
                      </Col>
                    </Row>
                  </div>
                }
              >
                {activities.map((activity) => (
                  <Collapse
                    expandIconPosition="end"
                    key={project.id}
                    className="mb-2 bg-white"
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Collapse.Panel
                      header={
                        <div>
                          <Row>
                            <Col span={5}>
                              <p className="font-medium">
                                {activity.list_title} ({projectTasks.length})
                              </p>
                            </Col>
                          </Row>
                        </div>
                      }
                    >
                      {projectTasks
                        .filter((task) => task.activity === activity.id)
                        .map((task) => (
                          <div
                            className="w-full py-2 px-4 mb-2 rounded-md border bg-white shadow-sm"
                            key={task.id}
                          >
                            <Row>
                              <Col span={12}>
                                <p className="font-medium">{task.task_name}</p>
                              </Col>
                              <Col span={6}>
                                <p className={`font-medium `}>
                                  Remaining Days:{" "}
                                  {getRemainingTimeDetails(task.due_date).text}
                                </p>
                              </Col>
                              <Col span={6}>
                                <p className={`font-medium `}>
                                  Status: {getPriority(task.status).text}
                                </p>
                              </Col>
                            </Row>
                          </div>
                        ))}
                    </Collapse.Panel>
                  </Collapse>
                ))}
              </Collapse.Panel>
            </Collapse>
          );
        })}
      </div>
    </Layout>
  );
};

export default ProjectDetails;
