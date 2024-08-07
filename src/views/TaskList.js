// App.js
import React, { useState, useEffect } from "react";

import TaskCardList from "../components/TaskCard";
import ActivityList from "../components/ActivityList";
import useAxios from "../utils/useAxios";
function TaskList() {
  const [activities, setActivities] = useState([]);
  const api = useAxios();
  useEffect(() => {
    const fetchActivities = async () => {
   
      try {
        const response = await api.get("/activitylist/");
        setActivities(response.data);
     
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div className="activities">
        {activities.map((activity) => (
          <ActivityList key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
