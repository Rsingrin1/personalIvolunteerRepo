// backend/controller/eventController.js

import Events from "../model/eventModel.js";
import User from "../model/userModel.js";
import mongoose from "mongoose";

// CREATE EVENT
// POST /api/event
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      date,
      location,
      notifMessage,
      notifTime,
      tags,
      imageUrl,
      attachmentUrls,
    } = req.body;

    if (!name || !date) {
      return res
        .status(400)
        .json({ message: "Event name and date are required." });
    }

    const organizerId = req.user?.id;
    if (!organizerId) {
      return res
        .status(401)
        .json({ message: "Organizer authentication required." });
    }

    const organizer = await User.findById(organizerId);
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found." });
    }

    const newEvent = new Events({
      name,
      description,
      date,
      location,
      notifMessage,
      notifTime,
      tags,
      imageUrl,
      attachmentUrls,
      organizer: organizer._id,
    });

    const savedEvent = await newEvent.save();

    organizer.events = organizer.events || [];
    organizer.events.push(savedEvent._id);
    await organizer.save();

    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// GET ALL EVENTS
// GET /api/events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Events.find()
      .populate("organizer", "username email userType")
      .populate("tags", "name description");
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// GET EVENT BY ID
// GET /api/event/:id
export const getEventById = async (req, res) => {
  try {
    const id = req.params.id;
    const eventExist = await Events.findById(id)
      .populate("organizer", "username email userType")
      .populate("tags", "name description");
    if (!eventExist) {
      return res.status(400).json({ message: "Event not found." });
    }
    res.status(200).json(eventExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// GET EVENTS FOR CURRENT ORGANIZER
// GET /api/events/organizer/:organizerId
export const getEventsByOrganizer = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    if (organizerId && organizerId !== userId) {
      return res
        .status(403)
        .json({ message: "Cannot view events for another organizer." });
    }

    const organizer = await User.findById(userId).populate({
      path: "events",
      populate: {
        path: "tags",
        select: "name description",
      },
    });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found." });
    }

    const events = organizer.events || [];
    return res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// UPDATE EVENT
// PUT /api/update/event/:id
export const updateEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;

    const eventExist = await Events.findById(id);
    if (!eventExist) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (eventExist.organizer.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this event." });
    }

    await Events.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({ message: "Event updated successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// DELETE EVENT
// DELETE /api/delete/event/:id
export const deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;

    const eventExist = await Events.findById(id);
    if (!eventExist) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (eventExist.organizer.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this event." });
    }

    await User.updateMany({ events: id }, { $pull: { events: id } });
    await Events.findByIdAndDelete(id);

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// APPLY TO EVENT
// POST /api/event/:id/apply
export const applyToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id; // from requireAuth

    const event = await Events.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    event.applicants = event.applicants || [];

    // 🔧 FIX: compare ObjectId -> string
    const alreadyApplied = event.applicants.some(
      (id) => id.toString() === userId.toString()
    );
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied to this event." });
    }

    event.applicants.push(userId);
    await event.save();

    return res
      .status(200)
      .json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("applyToEvent error:", error);
    return res
      .status(500)
      .json({ message: "Server error while applying to event." });
  }
};

// CANCEL APPLICATION OR PARTICIPATION
// POST /api/event/:id/cancel
export const cancelApplicationOrParticipation = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Events.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // remove user from applicants
    if (Array.isArray(event.applicants)) {
      event.applicants = event.applicants.filter(
        (id) => id.toString() !== userId
      );
    }

    // remove user from participants
    if (Array.isArray(event.participants)) {
      event.participants = event.participants.filter(
        (id) => id.toString() !== userId
      );
    }

    await event.save();

    return res
      .status(200)
      .json({ message: "Your application/participation has been cancelled." });
  } catch (error) {
    console.error("cancelApplicationOrParticipation error:", error);
    return res
      .status(500)
      .json({ message: "Server error while cancelling." });
  }
};

// ORGANIZER APPROVE
// POST /api/event/:eventId/approve/:volunteerId
export const approveVolunteer = async (req, res) => {
  try {
    const { eventId, volunteerId } = req.params;
    const organizerId = req.user?.id;

    const event = await Events.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found." });

    if (event.organizer.toString() !== organizerId.toString()) {
      return res.status(403).json({ message: "Not your event." });
    }

    event.applicants = event.applicants || [];
    event.participants = event.participants || [];

    event.applicants = event.applicants.filter(
      (id) => id.toString() !== volunteerId.toString()
    );

    const alreadyParticipant = event.participants.some(
      (id) => id.toString() === volunteerId.toString()
    );
    if (!alreadyParticipant) {
      event.participants.push(volunteerId);
    }

    await event.save();

    res.status(200).json({ message: "Volunteer approved." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// ORGANIZER DENY
// POST /api/event/:eventId/deny/:volunteerId
export const denyVolunteer = async (req, res) => {
  try {
    const { eventId, volunteerId } = req.params;
    const organizerId = req.user?.id;

    const event = await Events.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found." });

    if (event.organizer.toString() !== organizerId.toString()) {
      return res.status(403).json({ message: "Not your event." });
    }

    event.applicants = event.applicants || [];
    event.participants = event.participants || [];

    event.applicants = event.applicants.filter(
      (id) => id.toString() !== volunteerId.toString()
    );

    event.participants = event.participants.filter(
      (id) => id.toString() !== volunteerId.toString()
    );

    await event.save();

    res.status(200).json({ message: "Volunteer denied." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// GET EVENTS APPLIED TO BY CURRENT USER (VOLUNTEER)
// GET /api/my-events/volunteer
export const getMyVolunteerEvents = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // events where user is applicant or participant
    const events = await Events.find({
      $or: [{ applicants: userId }, { participants: userId }],
    })
      .populate("organizer", "username email userType")
      .populate("tags", "name description");

    return res.status(200).json(events || []);
  } catch (error) {
    console.error("getMyVolunteerEvents error:", error);
    return res.status(500).json({ errorMessage: error.message });
  }
};

// GET APPLICANTS & PARTICIPANTS FOR AN EVENT (ORGANIZER ONLY)
// GET /api/event/:id/applicants
export const getEventApplicants = async (req, res) => {
  try {
    const eventId = req.params.id;
    const organizerId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event id." });
    }

    const event = await Events.findById(eventId)
      .populate("applicants", "username email userType")
      .populate("participants", "username email userType");

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (event.organizer.toString() !== organizerId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not the organizer of this event." });
    }

    return res.status(200).json({
      eventName: event.name,
      eventDate: event.date,
      applicants: event.applicants || [],
      participants: event.participants || [],
    });
  } catch (error) {
    console.error("getEventApplicants error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching applicants." });
  }
};
