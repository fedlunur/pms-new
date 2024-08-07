import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useAxios from "../../utils/useAxios";
import { Draggable, Droppable } from "react-beautiful-dnd";
import MyFormDialog from "./EditTaskDialog";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import IssuePage from "../../views/issues/IssuePage";

import {
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
  // BiEdit,
  // BiTrash,
  // BiCheckCircle,
  // BiReset,
} from "react-icons/bi";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const items = [
  {
    key: "1",
    label: "Edit Task",
    icon: <EditOutlined />,
  },
  {
    key: "2",
    label: "Delete Task",
    icon: <DeleteOutlined />,
    danger: true,
  },
];

import { CiClock2, CiEdit, CiSquareCheck } from "react-icons/ci";
import { MdDeleteForever, MdDeleteOutline } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Avatar,
  Badge,
  Card,
  Collapse,
  Dropdown,
  Progress,
  Tooltip,
} from "antd";
import Checklist from "./Checklist";
import { ProgressBar } from "primereact/progressbar";

const ContainerCard = styled.div`
  border-radius: 10px;
  box-shadow: 5px 5px 5px 2px grey;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  min-height: 120px;
  margin-left: 10px;IssuePage
IssuePage
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

export default function Column({
  title,
  allusers,
  teammeber,
  incomingTasks,
  id,
  onDeleteActivity
}) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
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
    openConfirmationDialog(taskId);
  };

  const openConfirmationDialog = (taskId) => {
    setTaskToDelete(taskId);
    setConfirmationOpen(true);
  };

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

 
  const handleOpen = (selectedtask, taskmembers) => {
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
        setTaskToDelete(null);
        setConfirmationOpen(false);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };


  // console.log(tasks);
  function getPriority(priority) {
    if (priority === "0") {
      return { text: "Normal", color: "bg-orange-300 text-orange-500" };
    } else if (priority === "1") {
      return { text: "Low", color: "bg-green-300 text-green-500" };
    } else if (priority === "2") {
      return { text: "High", color: "bg-red-300 text-red-500" };
    } else {
      return { text: "None", color: "bg-gray-300 text-gray-500" };
    }
  }

  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  function getRemainingTimeDetails(dueDate) {
    if (!dueDate) return { text: "None", color: "text-red-500" };

    const now = new Date();
    const due = new Date(dueDate);

    // Calculate the difference in time
    const diff = due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);

    // Calculate the difference in days
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: "Passed", color: "text-red-400 bg-red-50" };
    if (days === 0)
      return { text: "Due today", color: "text-orange-400 bg-orange-50" };
    if (days === 1)
      return { text: "1 day left", color: "text-orange-400 bg-orange-50" };
    if (days === 2)
      return { text: "2 days left", color: "text-orange-400 bg-orange-50" };

    return { text: `${days} days left`, color: "text-gray-400 bg-gray-50" };
  }

  const handleMenuClick = (e, task) => {
    const functions = {
      1: () => handleOpen(task, taskmembers),
      2: () => removeTodo(task.id),
    };

    const action = functions[e.key];
    if (action) {
      action();
    } else {
      console.error("Unknown menu item clicked:", e.key);
    }
  };

  const menuProps = (task) => ({
    onClick: (e) => handleMenuClick(e, task),
    items,
  });

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
  const [openIssue, setOpenIssue] = useState(false);
  const IssueOpen = ({ task }) => {
    // console.log(task, "issue Drawer***");
    return (
      <Drawer
        className="capitalize relative"
        title="hey"
        placement="right"
        closable={true}
        onClose={onCloseIssue}
        open={openIssue}
        size="large"
      >
        <IssuePage task={task} />
      </Drawer>
    );
  };

  const showIssueDrawer = (task) => {
    // console.log(task, "show issue task props");
    setSelectedTask(task);
    setOpenIssue(true);
  };

  const onCloseIssue = () => {
    setOpenIssue(false);
  };
  const [openDrawer, setOpenDrawer] = useState(false);
  const DrawerModal = ({  taskName, onClose, taskchecklist }) => {
  
    const filteredSubtasks = taskchecklist.filter((taskm) => taskm.task === selectedTask.id);
    
    return (
      <Drawer
        className="capitalize"
        title={taskName}
        placement="right"
        closable={true}
        onClose={onClose}
        open={openDrawer}
      >
        <Checklist task={selectedTask}   taskchecklist={filteredSubtasks} />
      </Drawer>
    );
  };

  const showDrawer = (task) => {
    setSelectedTask(task)
    setOpenDrawer(true);
  };

  const onClose = () => {
    
    setOpenDrawer(false);
  };

  const [taskchecklist, setTaskchecklist] = useState([]);

  const fetchChecklist = async () => {
    try {
      const [projectsResponse, taskchecklist] = await Promise.all([
        api.get("/project/"),

        api.get("/taskchecklist/"),
      ]);

      if (projectsResponse.status < 200 || projectsResponse.status >= 300) {
        throw new Error("One or more network responses were not ok");
      }

      const taskchecklistdata = taskchecklist.data;

      setTaskchecklist(taskchecklistdata);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchChecklist();
    
  }, []);
  const activityBodyTemplate = (rowData) => {
    const relatedTasks = taskchecklist.filter(
      (taskm) => taskm.task === rowData.id
    );
  
    // Calculate completed and incomplete tasks
    const completedTasks = relatedTasks.filter((task) => task.status).length;
    const totalTasks = relatedTasks.length;
    const completedPercentage = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;
    const incompletePercentage = totalTasks
      ? Math.round(((totalTasks - completedTasks) / totalTasks) * 100)
      : 0;
  
    return (
      <div>
        <Progress
          percent={completedPercentage}
          strokeColor={{
            "0%": "#3b82f6",
            "100%": "#3f51b5",
          }}
          className="mb-3"
          size="small"
        />
      </div>
    );
  };
  

  return (
    <div className="w-full mr-2">
      <div
        className={`flex justify-between items-center sticky rounded-xl top-0 gap-2 item-center font-bold text-lg text-gray-800  mb-2 ${
          title === "To Do"
            ? "bg-blue-200"
            : title === "On Progress"
            ? "bg-orange-200"
            : title === "Done"
            ? "bg-green-200"
            : "bg-red-200"
        }`}
      >
        <div
          className={`w-[60%] rounded-xl px-3 py-3 h-full ${
            title === "To Do"
              ? "bg-blue-500"
              : title === "On Progress"
              ? "bg-orange-500"
              : title === "Done"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          <h3 className="text-sm text-left text-white">{title}</h3>
        </div>
        <div className="flex mx-4">

        <p className="text-sm text-right px-3 text-blue-500">{tasks.length}</p>
        <DeleteOutlined className="cursor-pointer text-blue-500" onClick={() => onDeleteActivity(id)}/>
        </div>
      </div>
      <div className="bg-transparent px-1 overflow-y-scroll h-[600px] w-full">
        <MyFormDialog
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
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
              className="p-2 space-y-1 bg-green-50"
            >
              {tasks
                .filter((task) => task.due_date || task.created_at)
                .map((task, index) => (
                  <Draggable
                    draggableId={`${task.id}`}
                    key={task.id}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      const { text: textPriority, color: colorPriority } =
                        getPriority(task.status);
                      const { color: colorTime, text: textTime } =
                        getRemainingTimeDetails(task.due_date);

                      return (
                        <div>
                          <Card
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            isDragging={snapshot.isDragging}
                            className="space-y-6 text-gray-800 rounded-xl shadow-lg mb-3"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex gap-2">
                                <Tooltip title={textPriority}>
                                  <div
                                    className={`${colorPriority} w-3 h-3 rounded-full`}
                                  ></div>
                                </Tooltip>
                                <CiSquareCheck
                                  className="cursor-pointer"
                                  size={16}
                                  onClick={() => showDrawer(task)}
                                />
                              </div>
                              <Dropdown menu={menuProps(task)}>
                                <BsThreeDotsVertical className="text-gray-500 cursor-pointer" />
                              </Dropdown>
                            </div>
                            <h1 className="text-sm font-semibold capitalize">
                              {task.task_name}
                            </h1>

                            <div className="flex flex-col mt-4">
                              <span className="text-xs">Progress</span>

                              {activityBodyTemplate(task)}
                            </div>
                            <div className="flex justify-between items-center">
                              <span
                                className="text-xs text-gray-600 cursor-pointer"
                                onClick={() => showIssueDrawer(task)}
                              >
                                Issues
                              </span>
                              <button
                                className={`py-1 px-3 text-xs rounded-full flex gap-1 ${colorTime}`}
                              >
                                <CiClock2 />
                                {textTime}
                              </button>
                            </div>
                          </Card>
                        </div>
                      );
                    }}
                  </Draggable>
                ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <DrawerModal
       
          taskchecklist={taskchecklist}
          taskName={selectedTask?.task_name}
          onClose={onClose}
        />
        <IssueOpen task={selectedTask} />
      </div>
    </div>
  );
}