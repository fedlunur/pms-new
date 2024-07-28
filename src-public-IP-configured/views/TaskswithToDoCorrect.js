import "../Todolist.css"; // app one folder
import { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import {
  BiCheckDouble,
  BiEdit,
  BiTrash,
  BiCheckCircle,
  BiReset,
  BiRefresh,
  BiBookAdd,
} from "react-icons/bi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation } from "react-router-dom";
export default function TaskswithToDoCorrect() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();

  const location = useLocation();

  const receivedItem =
    location.state && location.state.data ? location.state.data : null;
  console.log("here is recived Item with length" + receivedItem);
  useEffect(() => {
    if (receivedItem) {
      setActivities([receivedItem]); // Set receivedItem as a single-item array
    }
  }, []);

  return (
    <div style={{ paddingTop: 100 }}>
      <div className="todo-container ">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          activities.map((activity) => (
            <ActivityTasks key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}

function ActivityTasks({ activity }) {
  console.log("Fetching task now for ===> " + activity.list_title);
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();
  const location = useLocation();
  const receivedItem =
    location.state && location.state.data ? location.state.data : null;
  console.log("Here is the recived Item " + receivedItem.list_title);
  //const receivedItem = location.state ? location.state.item : null;
  useEffect(() => {
    fetchTasks();
  }, []); // Only fetch tasks when the activity changes

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      console.log(
        "The Single Acitivity id is to search for task" + activity.id
      );
      // const response = await api.get(`/tasklist/?activity=${activity.id}`);
      const response = await api.get(`/protask/api/tasklist/`);

      // Fetch tasks for the specific activity

      const filteredTasks = response.data.filter(
        (task) => task.activity === activity.id
      );

      // Set the filtered tasks as the state
      setTasks(filteredTasks);
      console.error(
        "Search and Found The task list total with ID  : ==> " + tasks.length
      );
    } catch (error) {
      console.error("Error fetching tasks for activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (inputValue.trim() !== "") {
      console.log(
        "I will send this data " + inputValue,
        activity.id + " " + "completed"
      );

      try {
        const response = await api.post(
          "/protask/api/tasklist/",
          JSON.stringify({
            // task_name: inputValue,
            // description: "",
            // due_date: null,
            // status: "",
            // due_date_reminder: null,
            // activity: activity.id,
            // created_by: null,

            task_name: inputValue,
            description: "",
            due_date: null,
            status: null,
            due_date_reminder: null,
            activity: activity.id,
            created_by: null,
          }),
          {
            headers: {
              "Content-Type": "application/json", // Specify the media type as JSON
              // Add any other headers or properties required by the server
            },
          }
        );

        setTasks([...tasks, response.data]);
        setInputValue("");

        console.log("Task added successfully:", response.data);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const startEdit = (index) => {
    setInputValue(tasks[index].task_name);
    setEditIndex(index);
  };

  const cancelEdit = () => {
    setInputValue("");
    setEditIndex(-1);
  };

  const updateTodo = async () => {
    if (editIndex !== -1 && inputValue.trim() !== "") {
      try {
        const updatedTask = { ...tasks[editIndex], task_name: inputValue };
        await api.put(`/protask/api/tasklist/${updatedTask.id}/`, updatedTask);
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = updatedTask;
        setTasks(updatedTasks);
        setInputValue("");
        setEditIndex(-1);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const removeTodo = async (taskId) => {
    try {
      await api.delete(`/protask/api/tasklist/${taskId}/`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleCompleted = async (taskId, completed) => {
    try {
      const updatedTask = {
        ...tasks.find((task) => task.id === taskId),
        completed: !completed,
      };
      await api.put(`/protask/api/tasklist/${taskId}/`, updatedTask);
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDragEnd = (result) => {
    // Handle drag and drop if needed
  };

  return (
    <div>
      <div>
        <h3>{receivedItem.list_title}</h3>
      </div>

      <div className="input-section">
        <input
          placeholder="please add new task"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          className="input-field"
        />
        {editIndex !== -1 ? (
          <>
            <button onClick={updateTodo} className="update-btn">
              <BiCheckDouble />
            </button>
            <button onClick={cancelEdit} className="cancel-btn">
              <BiRefresh />
            </button>
          </>
        ) : (
          <>
            <button onClick={addTodo} className="add-btn">
              <BiBookAdd />
            </button>
          </>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`tasks-${activity.id}`} direction="horizontal">
          {(provided) => (
            <ul
              className="todo-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={task.completed ? "completed" : ""}
                      >
                        {task.task_name}
                        <div className="btn-group">
                          <button
                            onClick={() => startEdit(index)}
                            className="btn-edit"
                          >
                            <BiEdit />
                          </button>
                          <button
                            onClick={() => removeTodo(task.id)}
                            className="btn-remove"
                          >
                            <BiTrash />
                          </button>
                          <button
                            onClick={() =>
                              toggleCompleted(task.id, task.completed)
                            }
                            className="btn-done"
                          >
                            {task.completed ? <BiReset /> : <BiCheckCircle />}
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
