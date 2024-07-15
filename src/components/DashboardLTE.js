import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import Layout from "../views/Layout";
import { useHistory } from "react-router-dom";
import Taksperday from "./Reports/Taskperday";
import PieChartDemo from "./Reports/Pychart";
import HorizontalBarDemo from "./Reports/HorizontalBar";
import StackedBarDemo from "./Reports/StackBar";
import { Card } from "primereact/card";

export default function DashboardLTE() {
  
  const [projects, setProjects] = useState([]);
  const [completedProjects, setCompletedprojects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
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
      ] = await Promise.all([
        api.get("/project/"),
        api.get("/activitylist/"),
        api.get("/teammembers/"),
        api.get("/users/"),
      ]);

      if (projectsResponse.status < 200 || projectsResponse.status >= 300) {
        throw new Error("One or more network responses were not ok");
      }

      const projectsData = projectsResponse.data;
      const activitiesData = activitiesResponse.data;
      const membersData = memberResponse.data;
      const usersData = userResponse.data;

      console.log(
        "actvities data are found  ===> yes" + activitiesResponse.data.length
      );
      setProjects(projectsData);
      setActivities(activitiesData);
      setMembers(membersData);
      setUsers(usersData);

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
      <div>
        <div className="content-wrapper">
          <section className="content">
            <div className="container-fluid py-5 px-5">
              <div className="row">
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-white">
                    <div className="inner">
                      <h3>{projects.length}</h3>
                      <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                        Total Projects
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fas fa-project-diagram text-indigo-600 text-xl" />
                    </div>
                    <a
                      onClick={() =>
                        ProjectDetail(projects, members, users, activities)
                      }
                      className="small-box-footer" style={{background:'#dde2e9'}}
                    >
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-white">
                    <div className="inner">
                      <h3>
                        {activities.length}
                        <sup style={{ fontSize: 20 }}></sup>
                      </h3>
                      <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                        Total Actitvities
                      </p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-stats-bars text-blue-500" />
                    </div>
                    <a href="#" className="small-box-footer" style={{background:'#dde2e9'}}>
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-white">
                    <div className="inner">
                      <h3>{completedActivities}</h3>
                      <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                        Completed Activities
                      </p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-person-add" style={{color:'#a7b4c6'}} />
                    </div>
                    <a href="#" className="small-box-footer" style={{background:'#dde2e9'}}>
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-white">
                    <div className="inner">
                      <h3>{users.length}</h3>
                      <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                        Total Members
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fa fa-users text-orange-400" />
                    </div>
                    <a
                      onClick={() =>
                        ProjectDetail(projects, members, users, activities)
                      }
                      className="small-box-footer" style={{background:'#dde2e9'}}
                    >
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="col-4">
                  <PieChartDemo />
                </div>
                <div class="col-8">
                  {/* <StackedBarDemo/> */}
                  <HorizontalBarDemo />
                </div>
              </div>
              <Taksperday />

              {/* <Mytimetable /> */}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
