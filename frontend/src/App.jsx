import React from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import StudentRegister from "./components/pages/StudentRegister";
import HomePage from "./components/pages/HomePage";
import Footer from "./components/layouts/Footer";
import InstituteRegister from "./components/pages/InstituteRegister";
import StudentDashboard from "./components/pages/StudentDashboard";
import InstituteDashboard from "./components/pages/InstituteDashboard";
import AdminRegistration from "./components/pages/AdminRegistration";
import LoginPage from "./components/pages/LoginPage";

const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

const MainApp = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/";

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/institute/register" element={<InstituteRegister />} />
        <Route path="/admin/register" element={<AdminRegistration />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/institute-dashboard" element={<InstituteDashboard />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
};

export default App;
