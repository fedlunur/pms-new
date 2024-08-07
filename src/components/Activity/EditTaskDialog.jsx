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

import ReactDatePicker from "react-datepicker";

import
{ DatePicker }
from
"antd"
;
import { Divider, Modal, Select } from "antd";

function MyFormDialog({
  open,
  selectedTask,
  allusers,
  assignedtaskmembers,
  handleClose,
  handleTaskUpdate,
}) {
  const api = useAxios();
  const [startDate, setStartDate] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [cover, setCover] = useState("");
  const [assignedmember, setAssignedMember] = useState([]);
  const [formData, setFormData] = useState({
    task_name: selectedTask ? selectedTask.task_name : "",
    status: selectedTask ? selectedTask.status : "",
    due_date: selectedTask ? selectedTask.due_date : null,
    cover: selectedTask ? selectedTask.cover : null,
  });



  const handleDateChange = (date) => {
    setStartDate(date);
    setFormData((prevFormData) => ({
      ...prevFormData,
      due_date: date,
    }));
  };

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        task_name: selectedTask.task_name,
        status: selectedTask.status,
        cover: selectedTask.cover,
        due_date: selectedTask.due_date
          ? new Date(selectedTask.due_date)
          : null,
      });

      setStartDate(
        selectedTask.due_date ? new Date(selectedTask.due_date) : null
      );
    }
  }, [selectedTask]);

  const handleSubmit = async () => {
    try {
      const formattedDueDate = formData.due_date
        ? formData.due_date.toISOString().split("T")[0]
        : null;

      const response = await api.patch(
        `/tasklist/${selectedTask.id}/`,
        {
          ...formData,
          due_date: formattedDueDate,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
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

    setSelectedValues(selectedList);
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
                <div className="flex flex-col">
                  <label>Status</label>
                  <Select
                    // style={{
                    //   width: ,
                    //   height:40
                    // }}
                    className="w-full"
                    size="large"
                    value={formData.status}
                    onChange={(e) => handleChange(e)}
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

            {/* <div className="">
              <div className="">
                <div className="">
                  <label>Check List </label>
                  <Checklist task={selectedTask} />
                </div>
              </div>
            </div> */}

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
                <label>Due Date</label>
                <div >
                  <DatePicker 
                    selected={startDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                  />
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
