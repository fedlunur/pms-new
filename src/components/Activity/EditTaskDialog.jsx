import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CustomMultiselect from "./MultiSelect";
import { ChromePicker } from "react-color";
import useAxios from "../../utils/useAxios";
import Checklist from "./Checklist";
import { Input,DatePicker,  message } from "antd";


import dayjs from 'dayjs';
import { Divider, Modal, Select } from "antd";
const dateFormat = 'YYYY-MM-DD'; 
function MyFormDialog({
  open,
  selectedTask,
  
  allusers,
  assignedtaskmembers,
  handleClose,
  handleTaskUpdate,

}) {
  const api = useAxios();
 
  const [cover, setCover] = useState("");

  const [formData, setFormData] = useState({
    task_name: selectedTask ? selectedTask.task_name : "",
    status: selectedTask ? selectedTask.status : "",
    due_date: selectedTask ? selectedTask.due_date : null,
    start_date: selectedTask ? selectedTask.start_date : null,
    cover: selectedTask ? selectedTask.cover : null,
  });



  const handleDateChangestart  = (dateString) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      due_date: dateString, // This will now be in YYYY-MM-DD format
    }));
  };
  const handleDateChange = (dateString) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      start_date: dateString, // This will now be in YYYY-MM-DD format
    }));
  };

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        task_name: selectedTask.task_name,
        status: selectedTask.status,
        cover: selectedTask.cover,
        due_date: selectedTask.due_date
          ,
        start_date:selectedTask.start_date  
        
      });

    
    }
  }, [selectedTask]);
  const handleTaskNameChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      task_name: value,
    }));
  };
  const handleSubmit = async () => {
    
    try {
      // const formattedDueDate = formData.due_date
      //   ? formData.due_date.toISOString().split("T")[0]
      //   : null;
      //   const formattedstartDate = formData.start_date
      //   ? formData.start_date.toISOString().split("T")[0]
      //   : null;
      const response = await api.patch(
        `/tasklist/${selectedTask.id}/`,
        {
          ...formData,
          // due_date: due_date,
          // start_date:formattedstartDate,
          cover: cover,
          
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        handleTaskUpdate(response.data);
        handleClose();
      } else {
        console.error("Task update failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleChange = (value, name) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  const onSelect = async (selectedList, selectedItem) => {
    if (!selectedItem) return;

    try {
      const response = await api.post("/taskmembers/", {
        assigned_to_id: selectedItem.value,
        task_id: selectedTask.id,
      });

      const newItemData = response.data;
    } catch (error) {
      console.error("Error adding item:", error);
    }

   // setSelectedValues(selectedItem);
  };



  const onRemove = async (selectedList, removedItem) => {
    if (!removedItem) return;

    try {
      await api.delete(`/taskmembers/${removedItem.value}/${selectedTask.id}/`);
      setSelectedValues(
        selectedList.filter((item) => item.value !== removedItem.value)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <Modal
      title={selectedTask ? selectedTask.task_name : ""}
      open={open}
      onOk={handleSubmit}
      onCancel={handleClose}
    >
      <Divider/>
      <div style={{ maxHeight: "550px", overflowY: "auto" }}>
        <div className="">
          <div className="">
            <div className="">
              <div className="">
              <div className="col-12">
        <div className="row">
        <label>Task Name</label>
        <Input
          placeholder="Task name"
          value={formData.task_name}
          onChange={(e) => handleTaskNameChange(e.target.value)}
        />
        </div>
        </div>
                <div className="flex flex-col">
                  <label>Status</label>
                  <Select
  className="w-full"
  size="large"
  value={formData.status}
  onChange={(value) => handleChange(value, "status")}
  options={[
    {
      value: "0",
      label: "Normal",
    },
    {
      value: "1",
      label: "Low",
    },
    {
      value: "2",
      label: "High",
    },
  ]}
/>
                </div>
              </div>
              
            </div>

      

            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Assign Task To</label>
                  <CustomMultiselect
                    options={
                      allusers
                        ? allusers.map((user) => ({
                            value: user.id,
                            label: user.first_name || "",
                          }))
                        : []
                    }
                    selectedValues={
                      assignedtaskmembers
                        ? assignedtaskmembers.map((user) => ({
                            value: user.assigned_to_id,
                            label: user.assigned_to_first_name || "",
                          }))
                        : []
                    }
                    onSelect={onSelect}
                    onRemove={onRemove}
                    displayValue="label"
                  />
                </div>
              </div>
            </div>

            <div className="row">
  <div className="col-12">
    <div className="row">
      <div className="col-6">
        <label>Start Date</label>
        <div>
        <DatePicker
           
            value={formData.start_date ? dayjs(formData.start_date, dateFormat) : null}
            onChange={(date, dateString) => handleDateChange(dateString)} 
            needConfirm
            format={dateFormat}
          />
        </div>
      </div>
      <div className="col-6">
        <label>End Date  </label>
        <div>
          <DatePicker
            value={formData.due_date ? dayjs(formData.due_date, dateFormat) : null}
            onChange={(date, dateString) => handleDateChangestart(dateString)} 
            needConfirm
            format={dateFormat}
          />
        </div>
      </div>
    </div>
  </div>
</div>

          </div>
        </div>
      </div>
    </Modal>
  );
}

export default MyFormDialog;
