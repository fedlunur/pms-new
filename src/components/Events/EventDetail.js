import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../utils/useAxios'; // Assuming you're using Axios with custom hooks

const EventDetails = () => {
  const { id } = useParams();
  const api = useAxios();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}/`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>Start Date: {new Date(event.start).toLocaleString()}</p>
      <p>End Date: {new Date(event.end).toLocaleString()}</p>
      <p>Created By: {event.created_by}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default EventDetails;
