// backend/routes/eventRoute.js
import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  getEventsByOrganizer,
  updateEvent,
  deleteEvent,
  applyToEvent,
  getMyVolunteerEvents,
  cancelApplicationOrParticipation,
  approveVolunteer,
  denyVolunteer,
  getEventApplicants,
} from "../controller/eventController.js";

import {
  requireAuth,
  requireOrganizer,
  requireVolunteerOrOrganizer,
} from "../middleware/authMiddleware.js";

const route = express.Router();

// Public
route.get("/events", getAllEvents);
route.get("/event/:id", getEventById);

// Organizer-only: list *their* events
route.get(
  "/events/organizer/:organizerId",
  requireAuth,
  requireOrganizer,
  getEventsByOrganizer
);

// Volunteer: their events (applied/approved)
route.get(
  "/my-events/volunteer",
  requireAuth,
  requireVolunteerOrOrganizer,
  getMyVolunteerEvents
);

// Organizer-only: create / update / delete
route.post("/event", requireAuth, requireOrganizer, createEvent);
route.put("/update/event/:id", requireAuth, requireOrganizer, updateEvent);
route.delete("/delete/event/:id", requireAuth, requireOrganizer, deleteEvent);

// Volunteer (or organizer acting as volunteer) applies to an event
route.post(
  "/event/:id/apply",
  requireAuth,
  requireVolunteerOrOrganizer,
  applyToEvent
);

// Volunteer or organizer cancels their involvement
route.post(
  "/event/:id/cancel",
  requireAuth,
  requireVolunteerOrOrganizer,
  cancelApplicationOrParticipation
);

// Organizer: get applicants & participants for an event
route.get(
  "/event/:id/applicants",
  requireAuth,
  requireOrganizer,
  getEventApplicants
);

// Organizer: approve a volunteer for an event
route.post(
  "/event/:eventId/approve/:volunteerId",
  requireAuth,
  requireOrganizer,
  approveVolunteer
);

// Organizer: deny/remove a volunteer for an event
route.post(
  "/event/:eventId/deny/:volunteerId",
  requireAuth,
  requireOrganizer,
  denyVolunteer
);

export default route;
