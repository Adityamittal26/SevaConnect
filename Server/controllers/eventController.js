import pool from "../config/db.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

/*
  CREATE EVENT (Organization only)
*/
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, volunteers_required } = req.body;

    // validation safeguard (Zod already validates, but double safety)
    if (!title || !volunteers_required) {
      throw new AppError(
        "Title and volunteers_required are required",
        400
      );
    }

    const organizer_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO events
       (title, description, volunteers_required, organizer_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description, volunteers_required, organizer_id]
    );

    res.status(201).json({
      message: "Event created successfully",
      event: result.rows[0],
    });

    logger.info(`Event created by user ${organizer_id}`);

  } catch (error) {
    next(error);
  }
};


/*
  GET ALL EVENTS (Paginated)
*/
export const getAllEvents = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT
         events.id,
         events.title,
         events.description,
         events.volunteers_required,
         events.created_at,
         users.name AS organizer_name,
         COUNT(applications.id) AS volunteers_joined,
         BOOL_OR(applications.volunteer_id = $1) AS already_applied
       FROM events
       JOIN users ON events.organizer_id = users.id
       LEFT JOIN applications
         ON events.id = applications.event_id
       GROUP BY events.id, users.name
       ORDER BY events.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const events = result.rows.map(event => ({
      ...event,
      is_full:
        Number(event.volunteers_joined) >=
        Number(event.volunteers_required),
    }));

    res.json({ page, limit, events });

  } catch (error) {
    next(error);
  }
};


/*
  VOLUNTEER APPLIES TO EVENT
*/
export const applyToEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const volunteer_id = req.user.id;

    // duplicate check
    const existing = await pool.query(
      `SELECT * FROM applications
       WHERE event_id = $1 AND volunteer_id = $2`,
      [eventId, volunteer_id]
    );

    if (existing.rows.length > 0) {
      throw new AppError(
        "Already applied to this event",
        400
      );
    }

    // check event + limit
    const countResult = await pool.query(
      `SELECT
         events.volunteers_required,
         COUNT(applications.id) AS current_count
       FROM events
       LEFT JOIN applications
         ON events.id = applications.event_id
       WHERE events.id = $1
       GROUP BY events.id`,
      [eventId]
    );

    if (countResult.rows.length === 0) {
      throw new AppError("Event not found", 404);
    }

    const event = countResult.rows[0];

    if (event.current_count >= event.volunteers_required) {
      throw new AppError(
        "Volunteer limit reached",
        400
      );
    }

    const result = await pool.query(
      `INSERT INTO applications (event_id, volunteer_id)
       VALUES ($1, $2)
       RETURNING *`,
      [eventId, volunteer_id]
    );

    res.status(201).json({
      message: "Application submitted successfully",
      application: result.rows[0],
    });

    logger.info(`User ${volunteer_id} applied to event ${eventId}`);

  } catch (error) {
    next(error);
  }
};


/*
  ORGANIZATION VIEWS APPLICANTS
*/
export const getEventApplicants = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const eventCheck = await pool.query(
      "SELECT * FROM events WHERE id = $1 AND organizer_id = $2",
      [eventId, req.user.id]
    );

    if (eventCheck.rows.length === 0) {
      throw new AppError(
        "You are not allowed to view applicants for this event",
        403
      );
    }

    const result = await pool.query(
      `SELECT
         users.id,
         users.name,
         users.email,
         applications.applied_at
       FROM applications
       JOIN users ON applications.volunteer_id = users.id
       WHERE applications.event_id = $1`,
      [eventId]
    );

    res.json({ applicants: result.rows });

  } catch (error) {
    next(error);
  }
};


/*
  VOLUNTEER VIEW APPLIED EVENTS
*/
export const getAppliedEvents = async (req, res, next) => {
  try {
    const volunteer_id = req.user.id;

    const result = await pool.query(
      `SELECT
         events.id,
         events.title,
         events.description,
         events.volunteers_required,
         events.created_at
       FROM applications
       JOIN events ON applications.event_id = events.id
       WHERE applications.volunteer_id = $1
       ORDER BY events.created_at DESC`,
      [volunteer_id]
    );

    res.json({ applied_events: result.rows });

  } catch (error) {
    next(error);
  }
};


/*
  ORGANIZATION GET OWN EVENTS
*/
export const getMyEvents = async (req, res, next) => {
  try {
    const organizer_id = req.user.id;

    const result = await pool.query(
      `SELECT
         events.id,
         events.title,
         events.description,
         events.volunteers_required,
         events.created_at,
         COUNT(applications.id) AS volunteers_joined
       FROM events
       LEFT JOIN applications
         ON events.id = applications.event_id
       WHERE events.organizer_id = $1
       GROUP BY events.id
       ORDER BY events.created_at DESC`,
      [organizer_id]
    );

    res.json({ events: result.rows });

  } catch (error) {
    next(error);
  }
};