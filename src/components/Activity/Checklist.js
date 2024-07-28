import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import useAxios from "../../utils/useAxios";
import axios from "axios"; // Import Axios
import { MdDeleteOutline } from "react-icons/md";
import { Input } from "antd";

function Checklist({ task }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const api = useAxios(); // Correctly defining the api variable here
  console.log(task,"taskssjhhf")

  useEffect(() => {
    const fetchChecklistItems = async () => {
      try {
        const response = await api.get(`/taskchecklist/?task=${task.id}`);
        console.log("The data based hgads asdd ====> " + response.data.length);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching checklist items:", error);
      }
    };

    fetchChecklistItems();
  }, [task.id,api]);
  console.log(items,"items in checklist")
  const handleAddItem = async () => {
    if (newItem.trim() === "") return;
    try {
      const response = await api.post("/taskchecklist/", {
        name: newItem,
        task: task.id,
      });
      const newItemData = response.data;
      setItems([...items, newItemData]);
      setNewItem("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleToggle = (itemId) => async () => {
    try {
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, status: !item.status } : item
      );
      setItems(updatedItems);
      await api.patch(`/taskchecklist/${itemId}/`, {
        status: updatedItems.find((item) => item.id === itemId).status,
      });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  const [loading, setLoading] = useState(false);

  const handleDeleteItem = (Incomingitem) => async () => {
    try {
      await api.delete(`/taskchecklist/${Incomingitem.id}/`);
      const updatedTasks = items.filter((item) => item.id !== Incomingitem.id);
      setItems(updatedTasks);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }} className="gap-1">
        <Input
          size="medium"
          placeholder="Enter Checklist"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
       
        <IconButton onClick={handleAddItem} className="">
          <AddIcon size={14} color="white" className="bg-black py-1"/>
        </IconButton>
      </div>
      <List sx={{ width: "100%"}}>
        {items.map((item) => (
          <ListItem key={item.id} disablePadding divider className ='text-xs'>
            <ListItemButton dense>
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <Checkbox
                  edge="start"
                  checked={item.status}
                  disableRipple
                  sx={{ padding: 0.5 }}
                  onClick={handleToggle(item.id)}
                  className="text-gray-800"
                />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{
                  flex: "1 1 auto",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textDecoration: item.status ? "line-through" : "none",
                }}
              />
              <IconButton onClick={handleDeleteItem(item)} >
              <MdDeleteOutline className="text-gray-800" size={16} />
              </IconButton>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Checklist;
