import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const role = localStorage.getItem("role");

  return (
    <div>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>SevaConnect</h2>

        <div>
          {role === "VOLUNTEER" && (
            <>
              <button onClick={() => navigate("/volunteer")}>
                Events
              </button>

              <button onClick={() => navigate("/applied")}>
                My Applications
              </button>
            </>
          )}

          {role === "ORGANIZATION" && (
            <button onClick={() => navigate("/organization")}>
              Dashboard
            </button>
          )}

          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div style={styles.container}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 25px",
    background: "#1f2937",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  container: {
    padding: "20px",
  },
};