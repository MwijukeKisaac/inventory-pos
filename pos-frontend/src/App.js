import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import POSScreen from "./pages/POSScreen";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={setRole} />} />

        {role === "ADMIN" && (
          <Route path="/admin" element={<AdminDashboard />} />
        )}

        {(role === "ADMIN" || role === "CASHIER") && (
          <Route path="/pos" element={<POSScreen />} />
        )}

        <Route
          path="*"
          element={<Navigate to={role ? "/pos" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
