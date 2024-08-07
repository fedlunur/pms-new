import { Modal, Input, Button, message } from "antd";
import Layout from "../../views/Layout";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DataService from "../DataServices";
import useAxios from "../../utils/useAxios";
import ActivityCard from "./ActvityCard";

export default function ActivityBoardList({}) {
  const api = useAxios();
  const location = useLocation();
  const projects = location.state && location.state.projects;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activityInputValue, setActivityInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  const { allactivities, alltasks, activities_by_project,tasksbyproject } = DataService();

  const fetchActivities = async () => {
    if (projects?.id) {
      try {
        const activitiesForProject = activities_by_project(projects);

        const tasksForProject = tasksbyproject(projects)
        setActivities(activitiesForProject);
        setTasks(tasksForProject);
      } catch (error) {
        console.error("Error fetching activities and tasks:", error);
      }
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [projects?.id, alltasks]);

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
            activity: toDoActivity.id,
            completed: false,
          });
          setTasks([...tasks, response.data]);
          setInputValue("");
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
        // await fetchActivities(); 
        setActivityInputValue("");
      } catch (error) {
        console.error("Error adding activity:", error);
      }
    }
  };

  const deleteActivity = async (activityId) => {
    try {
      await api.delete(`/activitylist/${activityId}/`);
      // setActivities(
      //   activities.filter((activity) => activity.id !== activityId)
      // );
      // await fetchActivities(); // Fetch new activities and tasks after adding a new activity

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
          <div className="flex gap-2">
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
          </div>
        </div>
        <ActivityCard
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
        <Input
          placeholder="Task name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          type="primary"
          className="mt-4"
          onClick={addTodo}
          disabled={!inputValue.trim()}
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
        <Button
          type="primary"
          className="mt-4"
          onClick={addActivity}
          disabled={!activityInputValue.trim()}
        >
          Create Activity
        </Button>
      </Modal>
    </Layout>
  );
}
