import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "VOLUNTEER",
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    await API.post("/auth/signup", form);
    alert("Signup successful");
    navigate("/");
  };

  return (
    <div>
      <h2>Signup</h2>

      <input placeholder="Name"
        onChange={(e)=>setForm({...form,name:e.target.value})}/>

      <input placeholder="Email"
        onChange={(e)=>setForm({...form,email:e.target.value})}/>

      <input type="password" placeholder="Password"
        onChange={(e)=>setForm({...form,password:e.target.value})}/>

      <select
        onChange={(e)=>setForm({...form,role:e.target.value})}
      >
        <option value="VOLUNTEER">Volunteer</option>
        <option value="ORGANIZATION">Organization</option>
      </select>

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}