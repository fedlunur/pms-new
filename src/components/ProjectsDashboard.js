import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import Layout from "../views/Layout";

import { useLocation } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import DatatableProjects from "./DatatableProjects";
import DataService from "./DataServices";

export default function ProjectsDashboard() {
  const api = useAxios();
  const [taskmembers, setTaskmembers] = useState([]);
  const [incomingprojects, setIncomingprojects] = useState([]);
  const [incomingactivities, setIncomingactivities] = useState([]);
  const [incomingTeammebers, setIncomingTeammebers] = useState([]);
  const [incomingusers, setIncomingUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUsers] = useState([]);

  const location = useLocation();
  const {
    allprojects,
    allactivities,
    alltasks,
    alluserss,
    alltaskmembers,
    allteammembers,
    loading,
  
  } = DataService(); // Assuming useCrud fetches data
 
  return (
    <Layout>
    
      <section
        className="w-full  flex flex-col space-y-4"
        style={{ height: "90vh" }}
      >
        <div className=" ">
          
          <DatatableProjects
            projects={allprojects}
            teammembers={allteammembers}
            users={alluserss}
            activities={allactivities}
            tasks={alltasks}
          />
        </div>
      </section>
    </Layout>
  );
}
