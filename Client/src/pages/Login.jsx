import { useState } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
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

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.user.role);

      toast("Login successful!");

      // redirect based on role
      if (res.data.user.role === "VOLUNTEER") {
        navigate("/volunteer");
      } else {
        navigate("/organization");
      }

    } catch (err) {
      toast("Login failed!");
    }
  };

  useEffect(() => {
  const params = new URLSearchParams(location.search);

  if (params.get("session") === "expired") {
    toast.warning("Session expired. Please login again.");

    // optional: remove query from URL after showing message
    navigate("/login", { replace: true });
  }
}, [location, navigate]);

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