import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function ViewApplicants() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    const res = await API.get(`/events/${id}/applicants`);
    setApplicants(res.data.applicants);
  };

  return (
    <div>
      <h2>Applicants</h2>

      {applicants.length === 0 && (
        <p>No applicants yet</p>
      )}

      {applicants.map((app) => (
        <div key={app.id} className="card">
          <h4>{app.name}</h4>
          <p>{app.email}</p>
          <p>Applied at: {app.applied_at}</p>
        </div>
      ))}
    </div>
  );
}