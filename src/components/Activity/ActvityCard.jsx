import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import useAxios from "../../utils/useAxios";
import { useLocation } from "react-router-dom";

export default function ActivityCard({ allusers, teammebers, projects }) {
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const api = useAxios();

  const location = useLocation();
  // const projects = location.state && location.state.projects;

  // const teammebers = location.state && location.state.teammebers;
  // const users = location.state && location.state.users;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesResponse = await api.get("/activitylist/");
        setActivities(activitiesResponse.data);

        const tasksResponse = await api.get("/tasklist/");
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = parseInt(draggableId);
    const updatedTask = tasks.find((task) => task.id === taskId);

    try {
      // Update task activity via API
      const response = await api.put(`/tasklist/${taskId}/`, {
        ...updatedTask,
        activity: destination.droppableId,
      });

      // Check if the API call was successful
      if (response.status === 200) {
        // Update local state with the updated task
        const updatedTaskData = response.data; // Assuming the API returns the updated task
        const updatedTasks = tasks.map((task) => {
          if (task.id === updatedTaskData.id) {
            return updatedTaskData;
          }
          return task;
        });
        setTasks(updatedTasks);
      } else {
        console.error("Error updating task:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className={`card  `}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            width: "1200px",
            margin: "0 auto",
          }}
        >
          {activities.map((activity) => {
            const tasksForActivity = tasks.filter(
              (task) => task.activity === activity.id
            );
            return (
              <Column
                key={activity.id}
                title={activity.list_title}
                allusers={allusers}
                teammeber={teammebers}
                incomingTasks={tasksForActivity}
                id={activity.id.toString()}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
