import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import Layout from "../views/Layout";
import ActivityList from "../views/ActivityList";
import { useLocation } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import DatatableProjects from "./DatatableProjects";

export default function ProjectsDashboard() {
  const api = useAxios();
  const [incomingprojects, setIncomingprojects] = useState([]);
  const [incomingTeammebers, setIncomingTeammebers] = useState([]);
  const [incomingusers, setIncomingUsers] = useState([]);
  const location = useLocation();
  const projects =
    location.state && location.state.projects
      ? location.state.projects
      : incomingprojects;
  const teammebers = location.state && location.state.teammebers;
  const users = location.state && location.state.users;
  const activities = location.state && location.state.activities;

  useEffect(() => {
    fetchProjects();
  }, []);
  const fetchProjects = async () => {
    const response = await api.get("/project/");
    setIncomingprojects(response.data);
    console.log("Incoming data Error ");
  };

  return (
    <Layout>
      <div>
        <div className="content-wrapper">
          {/* Main content */}
          <section className="content">
            <h1>Projects List</h1>
            <div className="container-fluid">
              {/* Small boxes (Stat box) */}
              <div className="row">
                {projects.map((Project) => (
                  <ProjectCard
                    key={Project.id}
                    title={Project.project_name}
                    content={Project.description}
                  />
                ))}
              </div>
            </div>
          </section>
          <DatatableProjects
            projects={projects}
            teammembers={teammebers}
            users={users}
            activities={activities}
          />
          {/* 
/* new data table      */}
        </div>
      </div>
    </Layout>
  );
}
