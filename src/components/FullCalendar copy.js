import React, { useState, useEffect } from "react";
import Layout from "../../views/Layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Toast } from "primereact/toast";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
} from "@mui/material";
import useAxios from "../../utils/useAxios";
import "./calendarStyles.css";

const BLUE = "#17405d"; // Adjust the color code as needed
const WHITE = "#FFFFFF";
function formatDate(date, formatString = "YYYY-MM-DD") {
  const formattedDatetime = new Date(date).toLocaleString();

  return formattedDatetime;
}
function MyTimeTable() {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    allDay: true,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const api = useAxios();
  const [showFields, setShowFields] = useState(false);

  const handleCheckboxChange = (e) => {
    setShowFields(e.target.checked);
    setNewEvent({ ...newEvent, allDay: e.target.checked });
  };

  const toast = React.useRef(null);
  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events/");
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching events:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error fetching events:",
        error,
      });
      setLoading(false);
    }
  };

  const handleDateClick = (selected) => {
    console.log(selected.startStr + "===");
    setNewEvent({
      // ...newEvent,
      title: "",
      start: selected.startStr,
      end: selected.endStr,
      allDay: false,
    });
    setOpen(true);
    setDialogOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setNewEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: false,
    });
    setDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleEventSave = async () => {
    try {
      if (newEvent.id) {
        const response = await api.put(`/events/${newEvent.id}/`, newEvent);
        if (response.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Event added Successfully !",
          });
        }
      } else {
        await api.post("/events/", newEvent);
      }
      fetchEvents();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEventDelete = async () => {
    try {
      if (newEvent.id) {
        await api.delete(`/events/${newEvent.id}/`);
        fetchEvents();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventDrop = async (eventDropInfo) => {
    const updatedEvent = {
      ...eventDropInfo.event.extendedProps,
      start: eventDropInfo.event.start.toISOString(),
      end: eventDropInfo.event.end?.toISOString(),
    };

    try {
      const response = await api.patch(
        `/events/${eventDropInfo.event.id}/`,
        updatedEvent
      );

      if (response.status === 200) {
        setEvents(
          events.map((event) =>
            event.id === eventDropInfo.event.id
              ? {
                  ...event,
                  start: eventDropInfo.event.start,
                  end: eventDropInfo.event.end,
                }
              : event
          )
        );
      } else {
        console.error("Error updating event:", response.data);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      eventDropInfo.revert(); // Revert the change if the API call fails
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewEvent({ title: "", start: "", end: "", allDay: false });
  };

  const handleSave = async () => {
    try {
      const response = await api.post("/events/", {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        allDay: newEvent.allDay,
      });

      if (response.status === 201) {
        const createdEvent = {
          id: response.data.id,
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          allDay: newEvent.allDay,
        };
        setEvents([...events, createdEvent]);
        handleClose();
      } else {
        console.error("Error creating event:", response.data);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };

  return (
    <Layout>
      <div>
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  {/* <h1 className="m-0">Scheduler</h1> */}
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="#">Scheduler</a>
                    </li>
                    <li className="breadcrumb-item active">......</li>
                  </ol>
                </div>
              </div>
              <section className="content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header" style={{}}>
                          <h3
                            className="card-title"
                            style={{
                              backgroundColor: "white",
                              color: "black",
                              margin: "0",
                              padding: "0",
                              fontStyle: "normal",
                              fontFamily: "inherit",
                            }}
                          >
                            Schedule Your Events
                          </h3>
                        </div>
                        <div className="card-body">
                          <Box display="flex" justifyContent="space-between">
                            <Box flex="1 1 20%" p="15px" borderRadius="4px">
                              <Typography variant="h5">Events</Typography>
                              <List>
                                {currentEvents.map((event) => (
                                  <ListItem
                                    key={event.id}
                                    sx={{
                                      background: "#c6d2db;",
                                      padding: " 9px",
                                      color: "black",
                                      margin: "6px 0",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography>{event.title}</Typography>
                                      }
                                      secondary={
                                        <Typography>
                                          {formatDate(event.start, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>

                            <Box flex="1 1 100%" ml="6px">
                              <FullCalendar
                                height="600px"
                                fullWidth="90%"
                                headerToolbar={{
                                  left: "prev,next today",
                                  center: "title",
                                  right:
                                    "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                                }}
                                plugins={[
                                  dayGridPlugin,
                                  timeGridPlugin,
                                  interactionPlugin,
                                  listPlugin,
                                ]}
                                initialView="dayGridMonth"
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                select={handleDateClick}
                                eventClick={handleEventClick}
                                events={events}
                                eventsSet={(updatedEvents) =>
                                  setCurrentEvents(updatedEvents)
                                }
                                eventDrop={handleEventDrop}
                                eventContent={(eventInfo) => {
                                  return (
                                    <div className="fc-event-con">
                                      <i>{eventInfo.event.title}</i>
                                    </div>
                                  );
                                }}
                              />
                            </Box>
                          </Box>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{newEvent.id ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent>
          <div style={{ padding: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Event Title"
              type="text"
              fullWidth
              name="title"
              value={newEvent.title || ""}
              onChange={handleInputChange}
            />
            {showFields !== true && (
              <form>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Start"
                  fullWidth
                  type="datetime-local"
                  name="start"
                  value={newEvent.start ? newEvent.start.replace("Z", "") : ""}
                  onChange={handleInputChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  label="Start"
                  fullWidth
                  type="datetime-local"
                  name="end"
                  value={newEvent.end ? newEvent.end.replace("Z", "") : ""}
                  onChange={handleInputChange}
                />
              </form>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={newEvent.allDay}
                  onChange={handleCheckboxChange}
                />
              }
              label="All Day"
            />
          </div>
        </DialogContent>
        <DialogActions>
          {newEvent.id && (
            <Button onClick={handleEventDelete} color="secondary">
              Delete
            </Button>
          )}
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEventSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default MyTimeTable;
