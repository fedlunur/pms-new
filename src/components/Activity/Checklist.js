import React, { useState, useEffect } from "react";
import { Input, List, Checkbox, Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useAxios from "../../utils/useAxios";

function Checklist({ task, taskchecklist, permissions }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const api = useAxios();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChecklistItems = async () => {
      try {
        setItems(taskchecklist);
      } catch (error) {
        console.error("Error fetching checklist items:", error);
      }
    };
    fetchChecklistItems();
  }, []);

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
      {permissions.canEdit && (
        <div style={{ display: "flex", alignItems: "center" }} className="gap-1">
          <Input
            size="medium"
            placeholder="Enter Checklist"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddItem}
            className="bg-black"
          />
        </div>
      )}
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            actions={[
              permissions.canEdit && (
                <Checkbox
                  checked={item.status}
                  onClick={handleToggle(item.id)}
                />
              ),
              permissions.canEdit && (
                <Button
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteItem(item)}
                  type="text"
                  danger
                />
              ),
            ]}
          >
            <List.Item.Meta
              title={
                <span
                  style={{
                    textDecoration: item.status ? "line-through" : "none",
                  }}
                >
                  {item.name}
                </span>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default Checklist;
