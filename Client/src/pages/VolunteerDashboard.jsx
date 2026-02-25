import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function VolunteerDashboard() {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data.events);
  };

  const apply = async (id) => {
    await API.post(`/events/apply/${id}`);
    alert("Applied!");
  };

  return (
    <div>
      <h2>Available Events</h2>

      <button onClick={() => navigate("/applied")}>
      View My Applications
    </button>

      {events.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>
            {event.volunteers_joined} /
            {event.volunteers_required}
          </p>

          <button onClick={() => apply(event.id)}>
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}