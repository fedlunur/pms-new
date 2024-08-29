import { Modal, Input, Button, message } from "antd";
import Layout from "../../views/Layout";
import { useLocation } from "react-router-dom";
import { useState,useContext, useEffect } from "react";

import useAxios from "../../utils/useAxios";
import ActivityCard from "./ActvityCard";import dayjs from 'dayjs';
import AuthContext from "../../context/AuthContext";
import useRole from "../useRole";
import
{ DatePicker }
from
"antd"
;

const dateFormat = 'YYYY-MM-DD'; 

export default function ActivityBoardList() {
  const api = useAxios();
  const location = useLocation();
  const projects = location.state && location.state.projects;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activityInputValue, setActivityInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logoutUser,roles } = useContext(AuthContext);
  const { hasAccess: canEdit  } = useRole(['Admin', 'ProjectCoordinator']);
  const { hasAccess: canAdd } = useRole(['Admin', 'ProjectCoordinator']);
  const { hasAccess: canDelete } = useRole(['Admin','ProjectCoordinator']);
  const { hasAccess: canView } = useRole(['Member','Admin','ProjectCoordinator']);
console.log("canEdit,canAdd,canDelete,canView",canEdit,canAdd,canDelete,canView,roles)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        activitiesResponse,
        tasksResponse,
      
      
      ] = await Promise.all([
        
        api.get(`/activitylist/byproject/${projects.id}/`),// Replace with your activity endpoint
        api.get("/tasklist/"), // Replace with your task endpoint
       // Replace with your task member endpoint
     

      ]);
      
      if (activitiesResponse.status < 200 || activitiesResponse.status >= 300) {
        throw new Error("One or more network responses were not ok");
      }  

     
      const activitiesData = activitiesResponse.data;
      const tasksData = tasksResponse.data;

  

   
      setActivities(activitiesData);
      setTasks(tasksData);
     
     
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };



  const showModal = () => {
    setIsModalOpen(true);
  };

  const showActivityModal = () => {
    setIsActivityModalOpen(true);
  };

  const handleOk = () => {
    addTodo();
    setIsModalOpen(false);
  };

  const handleActivityOk = () => {
    addActivity();
    setIsActivityModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsActivityModalOpen(false);
  };

  const addTodo = async () => {
    if (inputValue.trim() !== "") {
      try {
        const toDoActivity = activities.find(
          (activity) => activity.list_title === "To Do"
        );
        if (toDoActivity) {
          const response = await api.post("/tasklist/", {
            task_name: inputValue,
            start_date:startDate,
            due_date:endDate,
            activity: toDoActivity.id,
            completed: false,
          });
          setTasks([...tasks, response.data]);
          setInputValue("");
          fetchData();
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const addActivity = async () => {
    if (activityInputValue.trim() !== "") {
      try {
        await api.post("/activitylist/", {
          project_name: projects.id,
          list_title: activityInputValue,
        });
        setActivityInputValue("");
        fetchData(); // Refetch activities and tasks after adding an activity
      } catch (error) {
        console.error("Error adding activity:", error);
      }
    }
  };
  const handleDateChangestart  = (dateString) => {
    
    setStartDate(dateString)

  };
  const handleDateChange = (dateString) => {
 
    setEndDate(dateString)
  };

  const deleteActivity = async (activityId) => {
    try {
      await api.delete(`/activitylist/${activityId}/`);
      fetchData(); // Refetch activities and tasks after deleting an activity
      message.success("Activity deleted successfully");
    } catch (error) {
      console.error("Error deleting activity:", error);
      message.error("Failed to delete activity");
    }
  };

  return (
    <Layout>
      <div
        className="w-[100%] flex flex-col space-y-4"
        style={{ height: "90vh" }}
      >
        <div className="flex justify-between font-bold">
          <h1 className="text-lg capitalize text-gray-800 font-semibold">
            {projects?.project_name} Kanban Board
          </h1>
      { canAdd ? <div className="flex gap-2">
            <button
              className="text-white rounded-md bg-blue-500 py-2 px-4"
              onClick={showModal}
              
            >
              Add Task
            </button>
            <button
              className="rounded-md text-blue-500 border-2 border-blue-500 py-2 px-4"
              onClick={showActivityModal}
             
            >
              Create Activity
            </button>
          </div> :null}
        </div>
        <ActivityCard
      key={`${activities.length}-${tasks.length}`} // Unique key to force re-render
      projects={projects}
      tasks={tasks}
      activities={activities}
      onDeleteActivity={deleteActivity}
        />
      </div>

      <Modal
        title="Add Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="col-12">
        <div className="row">
        <Input
          placeholder="Task name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        </div>
        </div>
          <div className="col-12">
       <div className="row">
      <div className="col-6">
        <label>Start Date</label>
        <div>
        <DatePicker
           
            value={startDate ? dayjs(startDate, dateFormat) : null}
            onChange={(date, dateString) => handleDateChangestart (dateString)} 
     
            format={dateFormat}
          />
        </div>
      </div>
      <div className="col-6">
        <label>End Date  </label>
        <div>
          <DatePicker
            value={endDate ? dayjs(endDate, dateFormat) : null}
            onChange={(date, dateString) => handleDateChange(dateString)} 
     
            format={dateFormat}
          />
        </div>
      </div>
    </div>
  </div>
        <Button
          type="primary"
          className="mt-4"
          onClick={addTodo}
          disabled={!inputValue.trim() || ! canAdd }
   
        >
          Add Task
        </Button>
      </Modal>

      <Modal
        title="Create Activity"
        open={isActivityModalOpen}
        onOk={handleActivityOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Activity name"
          value={activityInputValue}
          onChange={(e) => setActivityInputValue(e.target.value)}
        />
       
      </Modal>
    </Layout>
  );
}
