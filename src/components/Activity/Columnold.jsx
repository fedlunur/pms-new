// {id, task_name, description, due_date, status, due_date_reminder, cover, created_at, updated_at, activity, created_by})

import React, { useState, useEffect } from "react";
import styled from "styled-components";

import useAxios from "../../utils/useAxios";
import { Draggable } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import MyFormDialog from "./EditTaskDialog";

import { Avatar } from "@material-ui/core";
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

export default function Column({ title, incomingTasks, id }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  const api = useAxios();
  useEffect(() => {
    if (incomingTasks) {
      // Assign incoming tasks to the tasks state immediately
      setTasks(incomingTasks);
    }
  }, [incomingTasks]);
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

  const handleOpen = (selectedtask, index) => {
    setSelectedTask(selectedtask);

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
  const removeTodo = async (taskId) => {
    try {
      await api.delete(`/tasklist/${taskId}/`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
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
  return (
    <Container className="column">
      {
        <MyFormDialog
          open={open}
          selectedTask={selectedTask}
          handleClose={handleClose}
          handleTaskUpdate={handleTaskUpdate}
        />
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
            {tasks.map((task, index) => (
              <Draggable draggableId={`${task.id}`} key={task.id} index={index}>
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
                        justifyContent: "space-between", // Aligns items with space between them
                        padding: 2,
                      }}
                    >
                      <span>
                        <small>#{task.id}</small> {/* First small element */}
                      </span>
                      <span>
                        <small>
                          {" "}
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
                            <Avatar
                              onClick={() => console.log(task)}
                              src={
                                "https://joesch.moe/api/v1/random?key=" +
                                task.id
                              }
                            />
                            <button
                              onClick={() => handleOpen(task)}
                              className="btn btn-tool"
                            >
                              <i className="fas fa-pen" />
                            </button>

                            <button
                              onClick={() => getDetails(task.id)}
                              className="btn btn-tool"
                            >
                              <i className="fas fa-book" />
                            </button>
                          </div>
                        </small>
                      </span>
                    </div>

                    {provided.placeholder}
                  </ContainerCard>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}
