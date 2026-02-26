import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import AppliedEvents from "./pages/AppliedEvents";
import ViewApplicants from "./pages/ViewApplicants";
import Layout from "./components/Layout";
import { Navigate } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* VOLUNTEER */}
        <Route element={<ProtectedRoute role="VOLUNTEER"><Layout /></ProtectedRoute>}>
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/applied" element={<AppliedEvents />} />
        </Route>

        {/* ORGANIZATION */}
        <Route element={<ProtectedRoute role="ORGANIZATION"><Layout /></ProtectedRoute>}>
          <Route path="/organization" element={<OrganizationDashboard />} />
          <Route path="/organization/event/:id" element={<ViewApplicants />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;