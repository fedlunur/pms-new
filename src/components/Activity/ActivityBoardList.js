import { Modal, Input, Button } from "antd";
import Layout from "../../views/Layout";
import ActivityCard from "./ActvityCard";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DataService from "../DataServices";
import useAxios from "../../utils/useAxios";
import { add } from "date-fns";

export default function ActivityBoardList({}) {
  const api = useAxios();
  // const { activities_by_project, allactivities } = DataService();
  const location = useLocation();
  const projects = location.state && location.state.projects;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [toDo, setToDo] = useState([]);
console.log(projects,"projects*")
  // useEffect(() => {
  //   // const fetchactivities = async () => {

  //   if (projects) {
  //   const projectActivities = activities_by_project(projects);
  //   setActivities(projectActivities);
  //   const toDoActivity = activities.find(
  //     (activity) => activity.list_title === "To Do"
  //   );
  //   console.log(toDoActivity, "toDoActivity***");
  //   setToDo(toDoActivity);
  // }
  // }, []);

  // const toDoActivity = allactivities.find((activity) => activity.list_title === "To Do" && activity.project_name == projects.id);
  // console.log(activities, "before activities");
  // console.log(toDo, "toDoActivity");

  // console.log(allactivities, "allactivities");

  // console.log(activities, "activities", projects.id);
  const { allactivities,alltasks,alluserss,alltaskmembers, loading, error, activities_by_project, tasksbyproject } = DataService(); // Assuming useCrud fetches data

// Get activities for the project (assuming projects.id holds the project ID)
// Use optional chaining to handle potential undefined project ID
console.log("Before ###The Fetched Activites  are:", allactivities); // Log activities after fetching
console.log("Before ### Fetched taks  already fetched from useCrud",alltasks);
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    addTodo();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addTodo = async () => {
    console.log(activities, "activities in func");

    if (inputValue.trim() !== "") {
      try {
        const toDoActivity = activities.find(
          (activity) => activity.list_title === "To Do"
        );
        console.log(toDoActivity,"toDoActivity in add");
        if (toDoActivity) {
          const response = await api.post("/tasklist/",{
            task_name: inputValue,
            activity: toDoActivity.id,
            completed: false,
          });
          setTasks([...tasks, response.data]);
          console.log('Saved')
          setInputValue("");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  

  return (
    <Layout>
      <div
        className="w-full flex flex-col space-y-4"
        style={{ height: "90vh" }}
      >
        <div className="flex justify-between font-bold">
          <h1 className="text-lg capitalize text-gray-800 font-semibold">
            {projects?.project_name} Kanban Board
          </h1>
          <button
            className="text-white rounded-md bg-blue-500 py-2 px-4"
            onClick={showModal}
          >
            Add Task
          </button>
        </div>
        <ActivityCard
          projects={projects}
          tasks={tasks}
          activities={activities}
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
    </Layout>
  );
}
