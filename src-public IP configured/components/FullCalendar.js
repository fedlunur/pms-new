import React, { useState, useEffect } from "react";
import Layout from "../views/Layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, List, ListItem, ListItemText, Checkbox, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import useAxios from "../utils/useAxios";
import "./calendarStyles.css";

const BLUE = '#17405d'; // Adjust the color code as needed
const WHITE = '#FFFFFF';
function formatDate(date, formatString = "YYYY-MM-DD") {
  const formattedDatetime = new Date(date).toLocaleString();

  return formattedDatetime;
}
function MyTimeTable() {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", allDay: true });
  const api = useAxios();

  useEffect(() => {
    setLoading(true);
    const fetchEvents = async () => {
      try {
        const response = await api.get("/protask/api/events/");
        const fetchedEvents = response.data;
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (selected) => {
    setNewEvent({
      ...newEvent,
      start: selected.startStr,
      end: selected.endStr,
      allDay: selected.allDay,
    });
    setOpen(true);
  };

  const handleEventClick = async (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
      try {
        await api.delete(`/protask/api/events/${selected.event.id}/`);
        selected.event.remove();
        setEvents(events.filter((event) => event.id !== selected.event.id));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleEventDrop = async (eventDropInfo) => {
    const updatedEvent = {
      ...eventDropInfo.event.extendedProps,
      start: eventDropInfo.event.start.toISOString(),
      end: eventDropInfo.event.end?.toISOString(),
    };

    try {
      const response = await api.patch(`/protask/api/events/${eventDropInfo.event.id}/`, updatedEvent);

      if (response.status === 200) {
        setEvents(events.map((event) =>
          event.id === eventDropInfo.event.id
            ? { ...event, start: eventDropInfo.event.start, end: eventDropInfo.event.end }
            : event
        ));
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
      const response = await api.post("/protask/api/events/", {
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
                            <Box
                              flex="1 1 20%"
                              p="15px"
                              borderRadius="4px"
                            >
                              <Typography variant="h5">Events</Typography>
                              <List>
                                {currentEvents.map((event) => (
                                  <ListItem
                                    key={event.id}
                                    sx={{
                                      background: BLUE,
                                      color: WHITE,
                                      margin: "10px 0",
                                      borderRadius: "2px",
                                    }}
                                  >
                                    <ListItemText
                                      primary={<Typography>{event.title}</Typography>}
                                      secondary={
                                        <Typography>
                                          {formatDate(event.start, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                          })}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>

                            <Box flex="1 1 100%" ml="15px">
                              <FullCalendar
                                height="590px"
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                headerToolbar={{
                                  left: "prev,next today",
                                  center: "title",
                                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                                }}
                                initialView="dayGridMonth"
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                select={handleDateClick}
                                eventClick={handleEventClick}
                                events={events}
                                eventsSet={(updatedEvents) => setCurrentEvents(updatedEvents)}
                                eventDrop={handleEventDrop}
                                eventContent={(eventInfo) => {
                                  return (
                                    <div>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            type="text"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <Box display="flex" alignItems="center">
            <Typography>All Day</Typography>
            <Checkbox
              checked={newEvent.allDay}
              onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default MyTimeTable;
