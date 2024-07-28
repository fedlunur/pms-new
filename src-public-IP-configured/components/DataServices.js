import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios"; // Assuming useAxios is in utils

export default function DataService() {
  const [allprojects, setProjects] = useState([]);
  const [allactivities, setAllactivities] = useState([]);
  const [alltasks, setTasks] = useState([]);
  const [alluserss, setUsers] = useState([]);
  const [alltaskmembers, setTaskmembers] = useState([]);
  const [allteammembers,setAllTeammembers] =useState([])
  const [allcardattachement,setAllcardtastattachments] =useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = useAxios();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        projectsResponse,
        activitiesResponse,
        tasksResponse,
        taskMemberResonse,
        userResponse,
        teammemberResponse,
        allcardattachementresponse,
      ] = await Promise.all([
        api.get("/proproject/api/project/"), // Replace with your project endpoint
        api.get("/protask/api/activitylist/"), // Replace with your activity endpoint
        api.get("/protask/api/tasklist/"), // Replace with your task endpoint
        api.get("/protask/api/taskmembers/"), // Replace with your task member endpoint
        api.get("/api/users/"), // Replace with your user endpoint
        api.get("/proproject/api/teammembers/"),
        api.get("/protask/api/task-attachments/")

      ]);

      if (projectsResponse.status < 200 || projectsResponse.status >= 300) {
        throw new Error("One or more network responses were not ok");
      }

      const projectsData = projectsResponse.data;
      const activitiesData = activitiesResponse.data;
      const tasksData = tasksResponse.data;
      const usersData = userResponse.data;
      const taskmemberdata = taskMemberResonse.data;
      const teammemberdata = teammemberResponse.data;
      const allcardattachedata=allcardattachementresponse.data
      setProjects(projectsData);
      setAllactivities(activitiesData);
      setTasks(tasksData);
      setUsers(usersData);
      setTaskmembers(taskmemberdata);
      setAllTeammembers(teammemberdata);
      setAllcardtastattachments(allcardattachedata)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(" All Datas are " ,allactivities)
  console.log(" All Projects are " ,allprojects)
  // Helper functions to filter or manipulate data
  const activities_by_project = (projectid) => {
    console.log(" CRUD calling" ,allactivities ," and the id is ",projectid )
    const activityList =allactivities.filter(
      (activity) => activity.project_name=== projectid.id
    );
    console.log(" CRUD Returning" ,activityList)
    return activityList;
  };

  const tasksbyactivity = (activityid) => {
    const tasklist = alltasks.filter((task) => task.activity.id === activityid);
    return tasklist;
  };

  const tasksbyproject = (projectid) => {
    const activityList = allactivities.filter(
      (activity) => activity.project_name === projectid
    );
    const tasklist = alltasks.filter((task) =>
      activityList.some((activity) => activity.id === task.activity)
    );
    return tasklist;
  };

  // Optional functions for creating, updating, and deleting data
  // Implement these based on your API requirements
  const create = async (data) => {
    // ... (implementation for creating data using the api object)
  };

  const update = async (id, data) => {
    // ... (implementation for updating data using the api object)
  };

  const remove = async (id) => {
    // ... (implementation for deleting data using the api object)
  };

  // Return the state and functions as an object (or individual values)
  return {
    allprojects,
    allactivities,
    alltasks,
    alluserss,
    alltaskmembers,
    allteammembers,
    allcardattachement,
    loading,
    error,
    activities_by_project,
    tasksbyactivity,
    tasksbyproject,
    create, // Optional, if implemented
    update, // Optional, if implemented
    remove, // Optional, if implemented
  };
}
