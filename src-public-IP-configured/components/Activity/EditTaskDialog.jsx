import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CustomMultiselect from "./MultiSelect";
import { ChromePicker } from "react-color";
import useAxios from "../../utils/useAxios";
// import InfiniteCalendar from "react-infinite-calendar";
// import "react-infinite-calendar/styles.css";

// import 'react-calendar/dist/Calendar.css';
// import Calendar from 'react-calendar';
import Checklist from "./Checklist";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Calendar } from 'primereact/calendar';
function MyFormDialog({
  open,
  selectedTask,
  allusers,
  assignedtaskmembers,
  handleClose,
  handleTaskUpdate,
}) {
 

  const api = useAxios();
  const [startDate, setStartDate] = useState();

  const [selectedValues, setSelectedValues] = useState([]);
  const [cover, setCover] = useState();
  const [assignedmember, setAssignedMember] = useState([]);
  const [formData, setFormData] = useState({
    task_name: selectedTask ? selectedTask.task_name : "",
    status: selectedTask ? selectedTask.status : "",
    due_date: selectedTask ? selectedTask.due_date : null,
    cover: selectedTask ? selectedTask.cover : null,
  });

  // task check list

  // Usage

  const handleChangeColor = (newColor) => {
    setCover(newColor.hex);
  };
  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      due_date: date, // Update formData with the selected date
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
      // Format due_date to "YYYY-MM-DD" format
      const formattedDueDate = formData.due_date
        ? formData.due_date.toISOString().split("T")[0]
        : null;

      const response = await api.patch(
        `/protask/api/tasklist/${selectedTask.id}/`,
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
    if (!selectedItem) return; // Ensure selectedItem is not null or undefined

    try {
      // Post the selected user ID to the server
      const response = await api.post("/protask/api/taskmembers/", {
        assigned_to_id: selectedItem.value, // Assuming value holds the user ID
        task_id: selectedTask.id,
      });

      // Handle the response as needed
      const newItemData = response.data;
    } catch (error) {
      console.error("Error adding item:", error);
    }

    setSelectedValues(selectedList);
  };

  const onRemove = async (selectedList, removedItem) => {
    console.log(
      "%%%   I will remove this TaskMember with assigned_to ID: " +
        removedItem.value +
        " and task ID: " +
        selectedTask.id
    );
    if (!removedItem) return;

    try {
      await api.delete(`/protask/api/taskmembers/${removedItem.value}/${selectedTask.id}/`);
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
          {/* Your existing card content */}
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
                {/* <div className="col-md-6">
                  <div className="form-group">
                    <label>Task Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.task_name}
                      onChange={(e) => handleChange(e)}
                      name="task_name"
                    />
                  </div>
                </div> */}
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
                  {/* <InfiniteCalendar
                    name="due_date"
                    width={400}
                    height={200}
                    selected={startDate}
                    onSelect={handleDateChange} // Pass the handleDateChange function to onSelect
                  /> */}
                  <div className="card flex justify-content-center">
            <Calendar value={new Date()} onChange={(e) => setStartDate(e.value)} />
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
