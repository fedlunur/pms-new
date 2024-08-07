import React, { useState, useEffect } from "react";
import { Button, Drawer, Spin , Flex, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import useAxios from "../../utils/useAxios";
import { MdDeleteOutline } from "react-icons/md";
import { Input } from "antd";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";


const SubTaskDrawer = ({task, taskChecklist, onClose  }) => {
  console.log("Items sub list @@@@@@@@  ",taskChecklist)
  const [items, setItems] = useState(taskChecklist);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const api = useAxios();
  console.log("Items sub list",items)
  const handleAddItem = async () => {
    if (newItem.trim() === "") return;
    try {
      const response = await api.post("/taskchecklist/", {
        name: newItem,
        task: task.id,
      });
      setItems([...items, response.data]);
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

  const handleDeleteItem = (incomingItem) => async () => {
    try {
      await api.delete(`/taskchecklist/${incomingItem.id}/`);
      setItems(items.filter((item) => item.id !== incomingItem.id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const showLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <>
  
      <Drawer
        closable
        destroyOnClose
        title="Task Checklist"
        placement="right"
        open={true}
        onClose={onClose}
      >
        <div style={{ display: "flex", alignItems: "center" }} className="gap-1">
          <Input
            size="medium"
            placeholder="Enter Checklist"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <IconButton onClick={handleAddItem}>
            <AddIcon size={14} color="white" className="bg-black py-1" />
          </IconButton>
        </div>
        <List sx={{ width: "100%" }}>
          {items.map((item) => (
            <ListItem key={item.id} disablePadding divider className='text-xs'>
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
                <IconButton onClick={handleDeleteItem(item)}>
                  <MdDeleteOutline className="text-gray-800" size={16} />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SubTaskDrawer;
