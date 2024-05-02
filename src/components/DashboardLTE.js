import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import Layout from "../views/Layout";
import { useHistory } from "react-router-dom";

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
    console.log(
      "The page will be pushed with this ===> last activity " +
        projects.length +
        members.length +
        users.length +
        actvivitydata.length
    );
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
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
