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
import LoginPage from "./components/pages/LoginPage";
import Footer from "./components/layouts/Footer";

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
        <Route path="/institute/register" element={<StudentRegister />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
};

export default App;
