import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import useAxios from "../../utils/useAxios";
import { useLocation } from "react-router-dom";
import DataService from "../DataServices"; 

export default function ActivityCard({ projects }) {
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const api = useAxios();
  const { allactivities,alltasks,alluserss,alltaskmembers, loading, error, activities_by_project, tasksbyproject } = DataService(); // Assuming useCrud fetches data


const activitiesForProject = activities_by_project(projects);
useEffect(() => {
  // Set activities and tasks based on props or useCrud
  if (projects?.id) {
    setActivities(activitiesForProject);
  } else {
    // Handle case where project ID is not available (optional)
    console.log("Project ID not available for ActivityCard");
    // Set default values or empty arrays if needed
  }
  setTasks(alltasks); // Assuming alltasks is available from useCrud
}, [projects?.id, alltasks]);// Re-run useEffect if projects.id changes

console.log("###The Fetched Activites  are:", activities); // Log activities after fetching
console.log("### Fetched taks  already fetched from useCrud",tasks);

// Access team members and all users from useCrud (assuming they are returned)
const teammebers = alltaskmembers;
const allusers = alluserss;

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = parseInt(draggableId);
    const updatedTask = tasks.find((task) => task.id === taskId);
    console.log("Draggable task id is " + taskId);
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
          {activities.length > 0 &&
            activities.map((activity) => {
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
