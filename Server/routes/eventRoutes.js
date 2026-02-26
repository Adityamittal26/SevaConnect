import express from "express";
import { createEvent,getAllEvents,applyToEvent,getEventApplicants,getAppliedEvents,getMyEvents } from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ORGANIZATION"),
  createEvent
);

router.get(
  "/",
  authMiddleware,
  getAllEvents
);

router.post(
  "/apply/:eventId",
  authMiddleware,
  roleMiddleware("VOLUNTEER"),
  applyToEvent
);

router.get(
  "/:eventId/applicants",
  authMiddleware,
  roleMiddleware("ORGANIZATION"),
  getEventApplicants
);

router.get(
  "/applied/me",
  authMiddleware,
  roleMiddleware("VOLUNTEER"),
  getAppliedEvents
);

router.get(
  "/my-events",
  authMiddleware,
  roleMiddleware("ORGANIZATION"),
  getMyEvents
);

export default router;