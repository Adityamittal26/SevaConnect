import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // redirect based on role
      if (res.data.user.role === "VOLUNTEER") {
        navigate("/volunteer");
      } else {
        navigate("/organization");
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}