import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ActivityList() {
  const [activities, setActivities] = useState([
    { id: 0, text: "Activity 1", completed: false },
    { id: 1, text: "Activity 2", completed: false },
    { id: 2, text: "Activity 3", completed: false },
    { id: 3, text: "Activity 4", completed: false },
  ]);
  const [newActivity, setNewActivity] = useState("");

  const handleToggle = (activityId) => () => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const handleAddActivity = () => {
    if (newActivity.trim() !== "") {
      setActivities([
        ...activities,
        { id: activities.length, text: newActivity, completed: false },
      ]);
      setNewActivity("");
    }
  };

  const handleDeleteActivity = (activityId) => () => {
    setActivities(activities.filter((activity) => activity.id !== activityId));
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextField
          label="Add Activity"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          fullWidth
          sx={{ marginBottom: 1 }}
        />
        <IconButton onClick={handleAddActivity} color="primary">
          <AddIcon />
        </IconButton>
      </div>
      <List sx={{ width: "100%", maxWidth: 360 }}>
        {activities.map((activity) => (
          <ListItem key={activity.id} disablePadding divider>
            <ListItemButton dense>
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <Checkbox
                  edge="start"
                  checked={activity.completed}
                  disableRipple
                  sx={{ padding: 0.5 }}
                  onClick={handleToggle(activity.id)}
                />
              </ListItemIcon>
              <ListItemText
                primary={activity.text}
                sx={{
                  flex: "0 0 auto",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textDecoration: activity.completed ? "line-through" : "none",
                }}
              />
              <IconButton
                onClick={handleDeleteActivity(activity.id)}
                color="secondary"
                sx={{ marginLeft: "auto" }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
