// DataTable.js

import React, { useState, useEffect } from "react";
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

import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  ListSubheader,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useHistory } from "react-router-dom";
const DataTable = () => {
  const api = useAxios();
  const history = useHistory(); //to send data for new page

  const [groupedData, setGroupedData] = useState({});
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/activitylist/");
      const data = response.data;
      const grouped = {};
      data.forEach((item) => {
        if (!grouped[item.project_name]) {
          grouped[item.project_name] = [];
        }
        grouped[item.project_name].push({
          ...item,
          isEditing: false, // Add isEditing property for each item
        });
      });
      setGroupedData(grouped);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // send data to cardlist tasks page
  const sendDataDetail = (item) => {
    history.push("/taskactivities", { data: item });
  };

  const handleChange = (e, projectId, itemId) => {
    const { name, value } = e.target;
    setGroupedData((prevData) => ({
      ...prevData,
      [projectId]: prevData[projectId].map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      }),
    }));
  };

  const handleEdit = (projectId, itemId) => {
    setGroupedData((prevData) => ({
      ...prevData,
      [projectId]: prevData[projectId].map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            isEditing: true,
          };
        }
        return item;
      }),
    }));
    setIsEditing(true);
  };

  const handleCancelEdit = (projectId, itemId) => {
    setGroupedData((prevData) => ({
      ...prevData,
      [projectId]: prevData[projectId].map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            isEditing: false,
          };
        }
        return item;
      }),
    }));
    setIsEditing(false);
  };

  const handleUpdate = async (projectId, itemId) => {
    const updatedItem = groupedData[projectId].find(
      (item) => item.id === itemId
    );
    try {
      await api.put(`/activitylist/${itemId}/`, updatedItem);
      fetchData();
      setIsEditing(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      await api.post("/activitylist/", formData);
      fetchData();
      setFormData({});
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/activitylist/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Acticity List of Projects</h2>
      <div>
        <form onSubmit={handleAdd}>
          <TextField
            label="List Title"
            name="list_title"
            value={formData.list_title || ""}
            onChange={(e) =>
              setFormData({ ...formData, list_title: e.target.value })
            }
            required
          />
          <TextField
            label="Project Name"
            name="project_name"
            value={formData.project_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, project_name: e.target.value })
            }
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Add New
          </Button>
        </form>
      </div>
      {Object.keys(groupedData).map((projectId) => (
        <div key={projectId}>
          <h3>{projectId}</h3>
          {groupedData[projectId].map((item) => (
            <Card
              key={item.id}
              style={{
                margin: "10px",
                display: "inline-block",
                background: "#D4ECEB",
              }}
            >
              <CardContent
              // style={{
              //   color: "#F5FCFB",
              // }}
              >
                {item.isEditing ? (
                  <>
                    <TextField
                      label="List Title"
                      name="list_title"
                      value={item.list_title}
                      onChange={(e) => handleChange(e, projectId, item.id)}
                    />
                    <TextField
                      label="Project Name"
                      type="hidden"
                      name="project_name"
                      value={item.project_name}
                      rende
                      onChange={(e) => handleChange(e, projectId, item.id)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(projectId, item.id)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleCancelEdit(projectId, item.id)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <ListSubheader>
                      <Typography color="primary" variant="15">
                        {item.list_title}
                      </Typography>
                      <Divider />
                    </ListSubheader>

                    <Box mt={5}></Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(projectId, item.id)}
                    >
                      <BiEdit />
                    </Button>

                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(item.id)}
                    >
                      <BiTrash />
                    </Button>

                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => sendDataDetail(item)}
                    >
                      <BiCheckDouble />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataTable;
