import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import Layout from "../views/Layout";
import { useHistory } from "react-router-dom";
import { LuActivity } from "react-icons/lu";
import Taksperday from "./Reports/Taskperday";
import ProjectStatusChart from "./Reports/DoughnoutChart";
import PieChartDemo from "./Reports/Pychart";
import HorizontalBarDemo from "./Reports/HorizontalBar";
import StackedBarDemo from "./Reports/StackBar";
import DataService from "./DataServices";
// import { Card } from "primereact/card";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, Col, Flex, Row } from "antd";
import { AiFillProject } from "react-icons/ai";
import { RiTeamFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import PieChart from "./Reports/PieGraph";
import BarGraph from "./Reports/BarGraph";

import PieGraph from "./Reports/PieGraph";
import ProjectDashboardCard from "./ProjectDashboardCard";
import TasksBar from "./Reports/TasksBar";
export default function DashboardLTE() {
  const { alltasks } = DataService();

  const [projects, setProjects] = useState([]);
  const [completedProjects, setCompletedprojects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [issueData, setIssueData] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const api = useAxios();
  const history = useHistory();

 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        projectsResponse,
        activitiesResponse,
        memberResponse,
        userResponse,
        issueResponse,
      ] = await Promise.all([
        api.get("/project/"),
        api.get("/activitylist/"),
        api.get("/teammembers/"),
        api.get("/users/"),
        api.get("/comments/"),
      ]);

      if (projectsResponse.status < 200 || projectsResponse.status >= 300) {
        throw new Error("One or more network responses were not ok");
      }

      const projectsData = projectsResponse.data;
      const activitiesData = activitiesResponse.data;
      const membersData = memberResponse.data;
      const usersData = userResponse.data;
      const issueData = issueResponse.data;


      setProjects(projectsData);
      setActivities(activitiesData);
      setMembers(membersData);
      setUsers(usersData);
      setIssueData(issueData);

      const completedActivities = activitiesData.filter(
        (activity) => activity.status === "completed"
      ).length;
      setCompletedActivities(completedActivities);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const ProjectDetail = (projects, members, users, actvivitydata) => {
    history.push("/projectsDashboard", {
      projects: projects,
      users: users,
      teammebers: members,
      activities: actvivitydata,
    });
  };

  return (
    <Layout>
      <div className="">
        <div className="">
          <section className="">
          

            <div className="space-y-5 h-full w-full flex flex-col">
              <h1 className="text-lg font-thin ">
                Welcome, <span className="font-bold">User 😊</span>
              </h1>
              <Row gutter={16}>
                <Col span={6}>
                  <Card bordered={false} style={{ display: "flex" }}>
                    <Flex align="center" gap="small">
                      <div className=" bg-blue-50">
                        <AiFillProject
                          size={18}
                          className="m-3 text-blue-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-gray-950 ">
                          {projects.length}
                        </span>
                        <span className="text-xs text-gray-500">
                          Total Projects
                        </span>
                      </div>
                    </Flex>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card bordered={false} style={{ display: "flex" }}>
                    <Flex align="center" gap="small">
                      <div className=" bg-green-50">
                        <LuActivity size={18} className="m-3 text-green-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-gray-950 ">
                          {activities.length}
                        </span>
                        <span className="text-xs text-gray-500">
                          Total Activities
                        </span>
                      </div>
                    </Flex>
                  </Card>{" "}
                </Col>
                <Col span={6}>
                  <Card bordered={false} style={{ display: "flex" }}>
                    <Flex align="center" gap="small">
                      <div className=" bg-yellow-50">
                        <RiTeamFill size={18} className="m-3 text-yellow-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-gray-950 ">
                          {alltasks.length}
                        </span>
                        <span className="text-xs text-gray-500">
                          Total Tasks
                        </span>
                      </div>
                    </Flex>
                  </Card>{" "}
                </Col>
                <Col span={6}>
                  <Card bordered={false} style={{ display: "flex" }}>
                    <Flex align="center" gap="small">
                      <div className=" bg-red-50">
                        <FaUser size={18} className="m-3 text-red-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-gray-950 ">
                          {users.length}
                        </span>
                        <span className="text-xs text-gray-500">
                          Total Users
                        </span>
                      </div>
                    </Flex>
                  </Card>{" "}
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={18}>
                  {/* <div className="flex justify-between mb-2">
                    <div className="flex gap-3">
                      <button className="py-1 px-3 text-xs border-2 border-blue-500 rounded-sm font-semibold text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:border-blue-600 transition-colors duration-300">
                        Week
                      </button>
                      <button className="py-1 px-3 text-xs border-2 border-blue-500 rounded-sm font-semibold text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:border-blue-600 transition-colors duration-300">
                        Month
                      </button>
                      <button className="py-1 px-3 text-xs border-2 border-blue-500 rounded-sm font-semibold text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:border-blue-600 transition-colors duration-300">
                        Year
                      </button>
                    </div>
                  </div> */}

                  <BarGraph />
                  {/* <HorizontalBarDemo /> */}
                </Col>
                <Col span={6}>
                  <ProjectDashboardCard />
                </Col>
                <Col span={6}></Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <TasksBar />
                </Col>
                <Col span={12}>
                  <PieChartDemo />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  {/* <GanttChart tasks={ta} /> */}
                </Col>
              </Row>
              {/* <PieChart /> */}
              {/* <ProjectStatusChart finished={8} inProgress={2} pending={10} /> */}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}