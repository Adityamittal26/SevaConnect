import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "VOLUNTEER",
  });

  const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // only redirect if already logged in
  if (!token) return;

  if (role === "VOLUNTEER") {
    navigate("/volunteer", { replace: true });
  } else if (role === "ORGANIZATION") {
    navigate("/organization", { replace: true });
  }
}, [navigate]);

 const handleSignup = async () => {
  try {
    await API.post("/auth/signup", form);

    toast.success("Signup successful");
    navigate("/");
  } catch (error) {
    console.log(error);

    // show backend error if available
    const message =
      error.response?.data?.message || "Signup failed. Please try again.";

    toast.error("Signup failed!");
  }
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