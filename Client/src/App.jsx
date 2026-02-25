import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import AppliedEvents from "./pages/AppliedEvents";
import ViewApplicants from "./pages/ViewApplicants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/volunteer" element={<VolunteerDashboard />} />
        <Route path="/organization" element={<OrganizationDashboard />} />
        <Route path="/applied" element={<AppliedEvents />} />
        <Route path="/organization/event/:id" element={<ViewApplicants />} />
        <Route path="/volunteer"element={<ProtectedRoute><VolunteerDashboard /> </ProtectedRoute>}/>
        <Route path="/organization"element={<ProtectedRoute><OrganizationDashboard /> </ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;