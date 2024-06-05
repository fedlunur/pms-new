// ActivityList.js

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAxios from "../utils/useAxios";
import TaskCardList from "../components/TaskCardList";

function ActivityList({ activity }) {
  const [tasks, setTasks] = useState([]);
  const api = useAxios();
  useEffect(() => {
    const fetchTasksByActivityID = async () => {
      console.log("here is the data ===>  ");
      try {
        const response = await api.get(`taskslist/byactivity/${activity.id}/`);
        setTasks(response.data);
        console.log("here is the data ===>  " + response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchTasksByActivityID();
  }, []);

  return (
    <div className="activity">
      <h2>{activity.name}</h2>
      <TaskCardList tasks={tasks} activityId={activity.id} />
    </div>
  );
}

export default ActivityList;
