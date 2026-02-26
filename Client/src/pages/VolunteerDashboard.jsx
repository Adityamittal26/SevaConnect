import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { toast } from "react-toastify";

export default function VolunteerDashboard() {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data.events);
  };

  const apply = async (id) => {
  try {
    await API.post(`/events/apply/${id}`);
    toast.success("Application submitted!");
    fetchEvents();
  } catch (err) {
    toast.error(err.response?.data?.message || "Error applying");
  }
};

  return (
    <div>
      <h2>Available Events</h2>

      <button onClick={() => navigate("/applied")}>
        View My Applications
      </button>

      {events.map((event) => (
        <div key={event.id} className="card" >
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>
            {event.volunteers_joined} /
            {event.volunteers_required}
          </p>


          {event.already_applied ? (
            <button disabled>Already Applied</button>
          ) : event.is_full ? (
            <button disabled>Event Full</button>
          ) : (
            <button onClick={() => apply(event.id)}>
              Apply
            </button>
          )}
        </div>
      ))}
    </div>
  );
}