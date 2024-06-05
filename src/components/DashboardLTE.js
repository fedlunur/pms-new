import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import Layout from "../views/Layout";
import { useHistory } from "react-router-dom";
import Taksperday from "./Reports/Taskperday";
import PieChartDemo from "./Reports/Pychart";
import HorizontalBarDemo from "./Reports/HorizontalBar";
import StackedBarDemo from "./Reports/StackBar";


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
            <h1>Projects List</h1>
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>{projects.length}</h3>
                      <p>Total Projects</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-bag" />
                    </div>
                    <a
                      onClick={() =>
                        ProjectDetail(projects, members, users, activities)
                      }
                      className="small-box-footer"
                    >
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>
                        {activities.length}
                        <sup style={{ fontSize: 20 }}>%</sup>
                      </h3>
                      <p>Total Actitvities</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-stats-bars" />
                    </div>
                    <a href="#" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>{completedActivities}</h3>
                      <p>Completed Activities</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-person-add" />
                    </div>
                    <a href="#" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h3>{users.length}</h3>
                      <p>Total Members</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-pie-graph" />
                    </div>
                    <a
                      onClick={() =>
                        ProjectDetail(projects, members, users, activities)
                      }
                      className="small-box-footer"
                    >
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
              </div>

             
            {/* Example row of columns */}
            <div className="card flex justify-content-center" >
            <div className="row">
              <div className="col-md-4">
                <h2>Projects</h2>
                <p>
                Project controlling involves overseeing and regulating the various elements of 
                a project to ensure that it stays on track and within budget. This includes monitoring progress, 
                identifying risks and issues, and implementing corrective actions as necessary. Controlling also
                 involves managing resources efficiently to optimize project outcomes while adhering to timelines 
                 and quality standards.{" "}
                </p>
                <p>
                  <a className="btn btn-secondary" href="#" role="button">
                    View details »
                  </a>
                </p>
              </div>
              <div className="col-md-4">
                <h2>Tracking</h2>
                <p>
                involves the systematic monitoring and recording of project activities, milestones, and deliverables.
                 It provides stakeholders with real-time visibility into project progress, enabling them to make informed
                  decisions and take timely actions. Tracking encompasses aspects such as task completion, budget utilizat
                  ion, schedule adherence, and risk mitigation efforts. By tracking key performance indicators (KPIs),
                   project managers can identify trends, anticipate challenges, and adjust strategies accordingly to keep
                    the project on course.{" "}
                </p>
                <p>
                  <a className="btn btn-secondary" href="#" role="button">
                    View details »
                  </a>
                </p>
              </div>
              <div className="col-md-4">
                <h2>Performance Cheking </h2>
                <p>
                t involves setting clear performance objectives, establishing metrics to measure progress and outcomes,
                 and providing regular feedback and coaching to improve performance. Performance management also entails
                  recognizing and rewarding achievement, fostering a culture of accountability and continuous improvement, 
                  and addressing any performance gaps or issues that may arise.
                </p>
                <p>
                  <a className="btn btn-secondary" href="#" role="button">
                    View details »
                  </a>
                </p>
              </div>
            </div>
            </div>
            <hr />
          
         
              <Taksperday/>
            
  <div class="row">
    <div class="col-6">
      <PieChartDemo/>
    </div>
    <div class="col-6">
      <StackedBarDemo/>
    </div>

</div>
              {/* <Mytimetable /> */}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
