import { useEffect, useState } from "react";
import axios from "axios";

export default function useEvent(eventId) {
  const initialState = {
    _id: "",
    name: "",
    description: "",
    date: new Date().toISOString(),
    location: "",
    notifMessage: "",
    notifTime: new Date().toISOString(),
    tags: [],
    imageUrl: "",
    attachmentUrls: [],
    organizer: null,
    applicants: [],
    participants: [],
  };

  const [event, setEvent] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch event by ID
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/event/${eventId}`, {
          withCredentials: true,
        });
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event:", err.response?.status, err.message);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const addTag = (tag) => {
    setEvent({ ...event, tags: [...(event.tags || []), tag] });
  };

  const removeTag = (index) => {
    setEvent({
      ...event,
      tags: (event.tags || []).filter((_, i) => i !== index),
    });
  };

  const addAttachment = (url) => {
    setEvent({
      ...event,
      attachmentUrls: [...(event.attachmentUrls || []), url],
    });
  };

  const removeAttachment = (index) => {
    setEvent({
      ...event,
      attachmentUrls: (event.attachmentUrls || []).filter((_, i) => i !== index),
    });
  };

  // Create event (organizer only)
  const createEvent = async (eventData) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/event`, eventData, {
        withCredentials: true,
      });
      setEvent(res.data);
      return res.data;
    } catch (err) {
      console.error("Error creating event:", err.response?.data);
      throw err;
    }
  };

  // Update event (organizer only)
  const updateEvent = async () => {
    if (!event._id) throw new Error("Event ID is required");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/update/event/${event._id}`,
        event,
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error updating event:", err.response?.data);
      throw err;
    }
  };

  // Delete event (organizer only)
  const deleteEvent = async () => {
    if (!event._id) throw new Error("Event ID is required");
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/delete/event/${event._id}`,
        {
          withCredentials: true,
        }
      );
      setEvent(initialState);
      return res.data;
    } catch (err) {
      console.error("Error deleting event:", err.response?.data);
      throw err;
    }
  };

  // Apply to event (volunteer)
  const applyToEvent = async () => {
    if (!event._id) throw new Error("Event ID is required");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${event._id}/apply`,
        {},
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error applying to event:", err.response?.data);
      throw err;
    }
  };

  // Cancel application or participation (volunteer)
  const cancelEventParticipation = async () => {
    if (!event._id) throw new Error("Event ID is required");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${event._id}/cancel`,
        {},
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error cancelling participation:", err.response?.data);
      throw err;
    }
  };

  // Approve volunteer (organizer only)
  const approveVolunteer = async (volunteerId) => {
    if (!event._id) throw new Error("Event ID is required");
    if (!volunteerId) throw new Error("Volunteer ID is required");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${event._id}/approve/${volunteerId}`,
        {},
        {
          withCredentials: true,
        }
      );
      // Refresh event data to update applicants/participants
      const updated = await axios.get(`http://localhost:5000/api/event/${event._id}`, {
        withCredentials: true,
      });
      setEvent(updated.data);
      return res.data;
    } catch (err) {
      console.error("Error approving volunteer:", err.response?.data);
      throw err;
    }
  };

  // Deny volunteer (organizer only)
  const denyVolunteer = async (volunteerId) => {
    if (!event._id) throw new Error("Event ID is required");
    if (!volunteerId) throw new Error("Volunteer ID is required");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${event._id}/deny/${volunteerId}`,
        {},
        {
          withCredentials: true,
        }
      );
      // Refresh event data to update applicants/participants
      const updated = await axios.get(`http://localhost:5000/api/event/${event._id}`, {
        withCredentials: true,
      });
      setEvent(updated.data);
      return res.data;
    } catch (err) {
      console.error("Error denying volunteer:", err.response?.data);
      throw err;
    }
  };

  // Fetch event applicants and participants (organizer only)
  const getEventApplicants = async () => {
    if (!event._id) throw new Error("Event ID is required");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/event/${event._id}/applicants`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error fetching applicants:", err.response?.data);
      throw err;
    }
  };

  return {
    event,
    setEvent,
    inputHandler,
    addTag,
    removeTag,
    addAttachment,
    removeAttachment,
    createEvent,
    updateEvent,
    deleteEvent,
    applyToEvent,
    cancelEventParticipation,
    approveVolunteer,
    denyVolunteer,
    getEventApplicants,
    loading,
    error,
  };
}
