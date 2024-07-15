
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

  const handleChangeColor = (newColor) => {
    setCover(newColor.hex);
  };

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
        due_date: selectedTask.due_date ? new Date(selectedTask.due_date) : null,
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
          }
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
    <Dialog open={open} onClose={handleClose} scroll="paper">
      <DialogTitle>{selectedTask ? selectedTask.task_name : ""}</DialogTitle>
      <DialogContent dividers>
        <div style={{ maxHeight: "550px", overflowY: "auto" }}>
          <div className="card card-default">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="form-control select2"
                      style={{ width: "100%" }}
                      value={formData.status}
                      onChange={(e) => handleChange(e)}
                      name="status"
                    >
                      <option value="0">normal</option>
                      <option value="1">low</option>
                      <option value="2">high</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Legend Color </label>
                    <ChromePicker
                      value={formData.cover}
                      color={cover}
                      onChange={handleChangeColor}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Check List </label>
                    <Checklist task={selectedTask} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Assign Task To</label>
                    <CustomMultiselect
                      options={allusers.map((user) => ({
                        value: user.id,
                        label: user.first_name,
                      }))}
                      selectedValues={assignedtaskmembers.map((user) => ({
                        value: user.assigned_to_id,
                        label: user.assigned_to_first_name,
                      }))}
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
                  <div className="card flex justify-content-center">
                   
                    <ReactDatePicker
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MyFormDialog;
