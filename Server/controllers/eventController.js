import pool from "../config/db.js";

/*
  CREATE EVENT (Organization only)
*/
export const createEvent = async (req, res) => {
  try {
    const { title, description, volunteers_required } = req.body;

    // validation
    if (!title || !volunteers_required) {
      return res.status(400).json({
        message: "Title and volunteers_required are required",
      });
    }

    // logged-in organization id from JWT
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

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


/*
  GET ALL EVENTS
*/
export const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         events.id,
         events.title,
         events.description,
         events.volunteers_required,
         events.created_at,
         users.name AS organizer_name,
         COUNT(applications.id) AS volunteers_joined
       FROM events
       JOIN users ON events.organizer_id = users.id
       LEFT JOIN applications
         ON events.id = applications.event_id
       GROUP BY events.id, users.name
       ORDER BY events.created_at DESC`
    );

    res.json({ events: result.rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
  VOLUNTEER APPLIES TO EVENT
*/
export const applyToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const volunteer_id = req.user.id;

    // prevent duplicate applications
    const existing = await pool.query(
      `SELECT * FROM applications
       WHERE event_id = $1 AND volunteer_id = $2`,
      [eventId, volunteer_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Already applied to this event",
      });
    }

    // check volunteer limit
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
  return res.status(404).json({
    message: "Event not found",
  });
}

const event = countResult.rows[0];

// block if limit reached
if (event.current_count >= event.volunteers_required) {
  return res.status(400).json({
    message: "Volunteer limit reached",
  });
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

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/*
  ORGANIZATION VIEWS APPLICANTS FOR AN EVENT
*/
export const getEventApplicants = async (req, res) => {
  try {
    const { eventId } = req.params;

    // ensure event belongs to this organization
    const eventCheck = await pool.query(
      "SELECT * FROM events WHERE id = $1 AND organizer_id = $2",
      [eventId, req.user.id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(403).json({
        message: "You are not allowed to view applicants for this event",
      });
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

    res.json({
      applicants: result.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/*
  VOLUNTEER VIEW APPLIED EVENTS
*/
export const getAppliedEvents = async (req, res) => {
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

    res.json({
      applied_events: result.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};