import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function OrganizationDashboard() {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    volunteers_required: "",
  });

  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data.events);
  };

  const createEvent = async () => {
    await API.post("/events/create", event);
    alert("Event created");
    fetchEvents();
  };

  return (
    <div>
      <h2>Organization Dashboard</h2>

      <h3>Create Event</h3>

      <input
        placeholder="Title"
        onChange={(e) =>
          setEvent({ ...event, title: e.target.value })
        }
      />

      <input
        placeholder="Description"
        onChange={(e) =>
          setEvent({ ...event, description: e.target.value })
        }
      />

      <input
        placeholder="Volunteers Required"
        onChange={(e) =>
          setEvent({
            ...event,
            volunteers_required: e.target.value,
          })
        }
      />

      <button onClick={createEvent}>
        Create Event
      </button>

      <hr />

      <h3>My Events</h3>

      {events.map((e) => (
        <div key={e.id}>
          <h4>{e.title}</h4>
          <p>{e.description}</p>

          <p>
            Progress: {e.volunteers_joined} /
            {e.volunteers_required}
          </p>

          <button
            onClick={() =>
              navigate(`/organization/event/${e.id}`)
            }
          >
            View Applicants
          </button>
        </div>
      ))}
    </div>
  );
}