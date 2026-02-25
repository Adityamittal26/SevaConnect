import { useEffect, useState } from "react";
import API from "../services/api";

export default function AppliedEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchAppliedEvents();
  }, []);

  const fetchAppliedEvents = async () => {
    try {
      const res = await API.get("/events/applied/me");
      setEvents(res.data.applied_events);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>My Applied Events</h2>

      {events.length === 0 && <p>No applications yet</p>}

      {events.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>
            Needed: {event.volunteers_required}
          </p>
        </div>
      ))}
    </div>
  );
}