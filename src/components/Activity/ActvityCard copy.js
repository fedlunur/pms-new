import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAxios from "../../utils/useAxios";
import Taskcardbody from "./taskcardbody";
import {
  BiCheckDouble,
  BiRefresh,
  BiBookAdd,
  BiEdit,
  BiTrash,
  BiCheckCircle,
  BiReset,
} from "react-icons/bi";
export default function ActvityCard({ activity, project, headercolor }) {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();
  useEffect(() => {
    const fetchTasksByActivityID = async () => {
      console.log("here is the data ===>  ");
      try {
        const response = await api.get(`taskslist/byactivity/${activity.id}/`);
        setTasks(response.data);
      } catch (error) {}
    };

    fetchTasksByActivityID();
  }, []);

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  // const fetchTasks = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await api.get(`/tasklist/?activity=${activity.id}`); // Fetch tasks for the specific activity
  //     setTasks(response.data);
  //   } catch (error) {
  //     console.error("Error fetching tasks for activity:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
  const startEdit = (index) => {
    setInputValue(tasks[index].task_name);
    setEditIndex(index);
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
  // const toggleCompleted = async (taskId, completed) => {
  //   try {
  //     const updatedTask = {
  //       ...tasks.find((task) => task.id === taskId),
  //       completed: !completed,
  //     };
  //     await api.put(`/tasklist/${taskId}/`, updatedTask);
  //     const updatedTasks = tasks.map((task) =>
  //       task.id === taskId ? updatedTask : task
  //     );
  //     setTasks(updatedTasks);
  //   } catch (error) {
  //     console.error("Error updating task:", error);
  //   }
  // };

  const handleDragEnd = (result) => {
    // Handle drag and drop if needed
  };

  return (
    <div className={`card card-row ${headercolor}`}>
      <div className="card-header ">
        <h4>{activity.list_title}</h4>
      </div>

      <div className="card-body">
        {/* this are individual activities  */}
        <div className={`card ${headercolor} card-outline`}>
          {/* <div className="card-header">
            <h5 className="card-title">{tasks.task_name}</h5>
            <div className="card-tools">
              <a href="#" className="btn btn-tool btn-link">
                #1
              </a>
              <a href="#" className="btn btn-tool">
                <i className="fas fa-pen" />
              </a>
            </div>
          </div> */}
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
          {tasks.map((task, index) => (
            <div>
              {" "}
              <div className="card-body">
                {/* this are individual activities  */}
                <div className={`card card-outline`}>
                  <div className="card-header">
                    <h5>{task.task_name}</h5>
                    <div className="card-tools">
                      <button
                        onClick={() => startEdit(index)}
                        className="btn btn-tool "
                      >
                        <i className="fas fa-pen" />
                      </button>
                      <button
                        onClick={() => removeTodo(task.id)}
                        className="btn btn-tool"
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useAxios from "../../utils/useAxios";
import Taskcardbody from "./taskcardbody";
import {
  BiCheckDouble,
  BiRefresh,
  BiBookAdd,
  BiEdit,
  BiTrash,
  BiCheckCircle,
  BiReset,
} from "react-icons/bi";

export default function ActivityCard({ activity, project, headercolor }) {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const api = useAxios();

  useEffect(() => {
    const fetchTasksByActivityID = async () => {
      try {
        const response = await api.get(`taskslist/byactivity/${activity.id}/`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks for activity:", error);
      }
    };

    fetchTasksByActivityID();
  }, []);

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

  const startEdit = (index) => {
    setInputValue(tasks[index].task_name);
    setEditIndex(index);
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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceActivityId = parseInt(result.source.droppableId);
    const destinationActivityId = parseInt(result.destination.droppableId);
    console.log("This is task type ====> " + result.type);
    if (result.type === "DEFAULT") {
      // Reorder within the same activity
      if (sourceActivityId === destinationActivityId) {
        const updatedTasks = [...tasks];
        const [reorderedTask] = updatedTasks.splice(result.source.index, 1);
        updatedTasks.splice(result.destination.index, 0, reorderedTask);
        setTasks(updatedTasks);
      } else {
        // Move task to another activity
        const taskId = parseInt(result.draggableId);
        const updatedTask = tasks.find((task) => task.id === taskId);
        try {
          await api.put(`/tasklist/${taskId}/`, {
            ...updatedTask,
            activity: destinationActivityId,
          });

          // Remove task from source activity
          const updatedTasks = tasks.filter((task) => task.id !== taskId);

          // Add moved task to destination activity
          setTasks([...updatedTasks, updatedTask]);
        } catch (error) {
          console.error("Error moving task:", error);
        }
      }
    }
  };

  return (
    <div className={`card card-row ${headercolor}`}>
      <div className="card-header">
        <h4>{activity.list_title}</h4>
      </div>
      <div className="card-body">
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={activity.id.toString()}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="droppable-container"
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id.toString()}
                    draggableId={task.id.toString()}
                    index={index}
                    type="TASK"
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="draggable-item"
                      >
                        <div className="card-body">
                          <div className={`card card-outline`}>
                            <div className="card-header">
                              <h5>{task.task_name}</h5>
                              <div className="card-tools">
                                <button
                                  onClick={() => startEdit(index)}
                                  className="btn btn-tool"
                                >
                                  <i className="fas fa-pen" />
                                </button>
                                <button
                                  onClick={() => removeTodo(task.id)}
                                  className="btn btn-tool"
                                >
                                  <i className="fas fa-trash" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}




import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useAxios from "../../utils/useAxios";

import {
  BiCheckDouble,
  BiRefresh,
  BiBookAdd,
  BiEdit,
  BiTrash,
  BiCheckCircle,
  BiReset,
} from "react-icons/bi";

export default function ActivityCard({ activity, project, headercolor }) {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const api = useAxios();

  useEffect(() => {
    const fetchTasksByActivityID = async () => {
      try {
        const response = await api.get(`taskslist/byactivity/${activity.id}/`);
        setTasks(response.data);
        console.log("The size of tasks card is " + response.data);
        // setTasks(tasks.filter((task) => task.activity === activity.id));
      } catch (error) {
        console.error("Error fetching tasks for activity:", error);
      }
    };

    fetchTasksByActivityID();
  }, []);

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

  const startEdit = (index) => {
    setInputValue(tasks[index].task_name);
    setEditIndex(index);
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
  function deletePreviousState(sourceDroppableId, taskId) {
    switch (
      sourceDroppableId
      // case "1":
      //     setIncomplete(removeItemById(taskId, incomplete));
      //     break;
      // case "2":
      //     setCompleted(removeItemById(taskId, completed));
      //     break;
      // case "3":
      //     setInReview(removeItemById(taskId, inReview));
      //     break;
      // case "4":
      //     setBacklog(removeItemById(taskId, backlog));
      //     break;
    ) {
    }
  }

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    deletePreviousState(source.droppableId, draggableId);

    const sourceActivityId = parseInt(result.source.droppableId);
    const destinationActivityId = parseInt(result.destination.droppableId);
    console.log("This is task type ====> " + result.type);
    if (result.type === "DEFAULT") {
      // Reorder within the same activity
      if (sourceActivityId === destinationActivityId) {
        const updatedTasks = [...tasks];
        const [reorderedTask] = updatedTasks.splice(result.source.index, 1);
        updatedTasks.splice(result.destination.index, 0, reorderedTask);
        setTasks(updatedTasks);
      } else {
        // Move task to another activity
        const taskId = parseInt(result.draggableId);
        const updatedTask = tasks.find((task) => task.id === taskId);
        try {
          await api.put(`/tasklist/${taskId}/`, {
            ...updatedTask,
            activity: destinationActivityId,
          });

          // Remove task from source activity
          const updatedTasks = tasks.filter((task) => task.id !== taskId);

          // Add moved task to destination activity
          setTasks([...updatedTasks, updatedTask]);
        } catch (error) {
          console.error("Error moving task:", error);
        }
      }
    }
  };

  return (
    <div className={`card card-row ${headercolor}`}>
      <div className="card-header">
        <h4>{activity.list_title}</h4>
      </div>
      <div className="card-body">
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={activity.id.toString()}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="droppable-container"
              >
                {tasks
                  .filter((task) => task.activity === activity.id)
                  .map((task, index) => (
                    <Draggable
                      key={task.id.toString()}
                      draggableId={task.id.toString()}
                      index={index}
                      type="TASK"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable-item"
                        >
                          <div className="card-body">
                            <div className={`card card-outline`}>
                              <div className="card-header">
                                <h5>{task.task_name}</h5>
                                <div className="card-tools">
                                  <button
                                    onClick={() => startEdit(index)}
                                    className="btn btn-tool"
                                  >
                                    <i className="fas fa-pen" />
                                  </button>
                                  <button
                                    onClick={() => removeTodo(task.id)}
                                    className="btn btn-tool"
                                  >
                                    <i className="fas fa-trash" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
