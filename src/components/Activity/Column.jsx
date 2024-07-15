// {id, task_name, description, due_date, status, due_date_reminder, cover, created_at, updated_at, activity, created_by})

import React, { useState, useEffect } from "react";
import styled from "styled-components";

import useAxios from "../../utils/useAxios";
import { Draggable } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import MyFormDialog from "./EditTaskDialog";
import { Link } from 'react-router-dom';

import {
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import {
  BiCheckDouble,
  BiRefresh,
  BiBookAdd,
  BiEdit,
  BiTrash,
  BiCheckCircle,
  BiReset,
} from "react-icons/bi";
import { Droppable } from "react-beautiful-dnd";
const ContainerCard = styled.div`
  border-radius: 10px;
  box-shadow: 5px 5px 5px 2px grey;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  min-height: 120px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => bgcolorChange(props)};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div``;

const Icons = styled.div`
  display: flex;
  justify-content: end;
  padding: 2px;
`;
function bgcolorChange(props) {
  return props.isDragging
    ? "lightgreen"
    : props.isDraggable
    ? props.isBacklog
      ? "#F2D7D5"
      : "#DCDCDC"
    : props.isBacklog
    ? "#F2D7D5"
    : "#EAF4FC";
}
const Container = styled.div`
  background-color: #f4f5f7;
  border-radius: 1.5px;
  width: 600px;
  height: 660px; /* Set a fixed height */
  overflow-y: scroll; /* Enable vertical scrolling */
  border: 0px solid gray;
`;

const Title = styled.h3`
  padding: 8px;
  background-color: pink;
  text-align: center;
`;

const TaskList = styled.div`
  padding: 3px;
  transition: background-color 0.2s ease;
  background-color: #f4f5f7;
  min-height: 100px;
`;

export default function Column({
  title,
  allusers,
  teammeber,
  incomingTasks,

  id,
}) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [taskmembers, setTaskmembers] = useState([]);
  const [singletaskmembers, setSingletaskmembers] = useState([]);
  //confirmation
  const [taskToDelete, setTaskToDelete] = useState(null); // New state for task to delete
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const api = useAxios();
  useEffect(() => {
    if (incomingTasks) {
      // Assign incoming tasks to the tasks state immediately
      setTasks(incomingTasks);
    }
  }, [incomingTasks]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskmemberresponse = await api.get("/taskmembers/");

        setTaskmembers(taskmemberresponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const removeTodo = (taskId) => {
    openConfirmationDialog(taskId); // Open confirmation dialog
  };
  const openConfirmationDialog = (taskId) => {
    setTaskToDelete(taskId);
    setConfirmationOpen(true);
  };

  // Function to close confirmation dialog
  const closeConfirmationDialog = () => {
    setTaskToDelete(null);
    setConfirmationOpen(false);
  };
  const addTodo = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await api.post("/tasklist/", {
          task_name: inputValue,
          activity: id,
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

  const handleOpen = (selectedtask, taskmembers, index) => {
    setSelectedTask(selectedtask);

    const taskMemberslist = taskmembers.filter(
      (member) => member.task_id === selectedtask.id
    );
    setSingletaskmembers(taskMemberslist);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //dialog data update

  const getDetails = (index) => {
    setInputValue(tasks[index].task_name);
    setEditIndex(index);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await api.delete(`/tasklist/${taskToDelete}/`);
        const updatedTasks = tasks.filter((task) => task.id !== taskToDelete);
        setTasks(updatedTasks);
        setTaskToDelete(null); // Reset task to delete
        setConfirmationOpen(false); // Close confirmation dialog
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  function getLocacDate(date) {
    return date != null ? new Date(date).toLocaleDateString() : "";
  }

  function getPriority(priority) {
    console.log("priority is ======> " + priority);
    let pr = "Normal";
    if (priority === "0") {
      pr = "Normal";
    } else if (priority == "1") {
      pr = "Low";
    } else if (priority === "2") {
      pr = "High";
    } else pr = "none";
    return pr;
  }
  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  return (
    <Container className="column">
      {
        <>
          < MyFormDialog

             open={open}
             selectedTask={selectedTask}
             allusers={allusers}
             assignedtaskmembers={singletaskmembers}
             handleClose={handleClose}
             handleTaskUpdate={handleTaskUpdate}

          />
          <ConfirmationDialog
            open={confirmationOpen}
            onClose={closeConfirmationDialog}
            onConfirm={confirmDeleteTask}
          />
        </>
      }
      <Title
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "lightblue",

          justifyContent: "space-between",
          padding: 2,
          position: "sticky",
          top: "0",
        }}
      >
        <h3>{title}</h3>
        <Avatar style={{ width: 30, height: 30, marginRight: "30px" }}>
          {tasks.length}
        </Avatar>
      </Title>
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
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.map((task, index) => {
              return (
                <Draggable
                  draggableId={`${task.id}`}
                  key={task.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <ContainerCard
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      isDragging={snapshot.isDragging}
                    >
                      <div
                        style={{
                          display: "flex",
                          backgroundColor: task.cover == null ? "" : task.cover,
                          justifyContent: "space-between", // Aligns items with space between them
                          padding: 2,
                        }}
                      >
                        <span>
                          <small>
                            #{task.id}
                          </small>{" "}
                          {/* First small element */}
                        </span>
                        <span>
                          <small>
                            <div className="card-tools">
                              <button
                                onClick={() => startEdit(index)}
                              
                              >
                              <BiEdit />
                              </button>
                              <button
                                onClick={() => removeTodo(task.id)}
                               
                              >
                          
                                <BiTrash />
                              </button>
                            </div>
                          </small>{" "}
                          {/* Second small element */}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: 2,
                        }}
                      >
                        <TextContent>{task.task_name}</TextContent>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between", // Aligns items with space between them
                          padding: 2,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <small>{getLocacDate(task.due_date)}</small>
                          {/* Add space between the two small elements */}
                          <div style={{ width: 10 }} />
                          <small>{getPriority(task.status)}</small>
                        </span>

                        <span style={{ display: "flex", alignItems: "center" }}>
                          <small>
                            <div className="card-tools">
                              <div style={{ display: "flex", gap: "8px" }}>
                                {taskmembers &&
                                  taskmembers.length > 0 &&
                                  taskmembers
                                    .filter(
                                      (taskm) => taskm.task_id === task.id
                                    )
                                    .map((taskMember) => (
                                      <Avatar
                                        key={taskMember.id} // Don't forget to add a unique key for each avatar
                                        onClick={() => console.log(task)}
                                        src={
                                          "https://joesch.moe/api/v1/random?key=" +
                                          taskMember.assigned_to_id
                                        }
                                        
                                        style={{ cursor: "pointer" }} // Add cursor pointer for better UX
                                      />
                                    ))}
                                {/*  */}
                              </div>

                              <button
                                onClick={() => handleOpen(task, taskmembers)}
                                className=" btn-tool"
                              >
                              <BiEdit />
                              </button>

                          
                            </div>
                          </small>
                        </span>
                      </div>
                      <div>
                          <Link to={`/issues/${task.id}`}> 
                            <button className=" btn-tool">
                              {/* <BiBookAdd />  */}
                              Issues
                            </button>
                          </Link>
                        </div>

                      {provided.placeholder}
                    </ContainerCard>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}
