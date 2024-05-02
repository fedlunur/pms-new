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

export default function TaskswithToDoCorrect() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/tasklist/"); // Replace with your API endpoint to fetch activities
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 100 }}>
      <div className="todo-container ">
        <h1>To Do list</h1>
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
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/tasklist/?activity=${activity.id}`); // Fetch tasks for the specific activity
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks for activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await api.post("/tasklist/", {
          task_name: inputValue,
          activity: activity.id,

          completed: false,
        });
        setTasks([...tasks, response.data]);
        setInputValue("");
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
        await api.put(`/tasklist/${updatedTask.id}/`, updatedTask);
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
      await api.delete(`/tasklist/${taskId}/`);
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
      await api.put(`/tasklist/${taskId}/`, updatedTask);
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
      <h2>{activity.activity_name}</h2>
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
