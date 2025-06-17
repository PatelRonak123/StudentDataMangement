import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentRegister from "./components/pages/StudentRegister";
const App = () => {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<StudentRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
