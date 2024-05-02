import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CustomMultiselect from "./MultiSelect";
import { ChromePicker } from "react-color";
import useAxios from "../../utils/useAxios";
import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";
import CheckboxList from "./Checklist";

function MyFormDialog({
  open,
  selectedTask,
  allusers,

  handleClose,
  handleTaskUpdate,
}) {
  const api = useAxios();
  const [startDate, setStartDate] = useState();

  const [selectedValues, setSelectedValues] = useState();
  const [cover, setCover] = useState();

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
    setFormData((prevFormData) => ({
      ...prevFormData,
      due_date: date, // Update formData with the selected date
    }));
  };

  useEffect(() => {
    if (selectedTask) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        task_name: selectedTask.task_name,
        status: selectedTask.status,
        cover: selectedTask.cover,
        due_date: selectedTask.due_date
          ? new Date(selectedTask.due_date)
          : null,
      }));
      setStartDate(
        selectedTask.due_date ? new Date(selectedTask.due_date) : null
      ); // Set startDate to the due_date
    }
  }, [selectedTask]);

  const handleSubmit = async () => {
    try {
      // Format due_date to "YYYY-MM-DD" format
      const formattedDueDate = formData.due_date
        ? formData.due_date.toISOString().split("T")[0]
        : null;
      if (!selectedValues) {
        console.error("No users assigned to task");
        return;
      } else {
        // console.log(" #### =The selected Users are" + selectedValues);

        const assignedUsersIds = selectedValues.map((user) => user.value);

        console.log(
          "The payload data is" + selectedTask + " and " + assignedUsersIds
        );
        const payload = {
          task: selectedTask.id,
          // assigned_to: assignedUsersIds,
          assigned_users: assignedUsersIds,
          // Add other fields as needed
        };
        if (payload) {
          const responseusertask = await api.post("/taskmembers/", payload);
        }
        // } catch (error) {
        //   console.error("Error:", error);
        // }
      }
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

  function mapUserToOptions(users) {
    return users.map((user) => ({
      value: user.id, // Assuming user id is unique and can be used as value
      label: user.first_name, // Assuming user name is the label for the option
    }));
  }

  const options = mapUserToOptions(allusers);

  const onSelect = (selectedList, selectedItem) => {
    setSelectedValues(selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedValues(selectedList);
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
                    <CheckboxList />
                  </div>
                </div>
              </div>
              <div className="row"></div>
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Assign Task To</label>
                    <CustomMultiselect
                      options={options}
                      selectedValues={selectedValues}
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
                  <InfiniteCalendar
                    name="due_date"
                    width={400}
                    height={200}
                    selected={startDate}
                    onSelect={handleDateChange} // Pass the handleDateChange function to onSelect
                  />
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
