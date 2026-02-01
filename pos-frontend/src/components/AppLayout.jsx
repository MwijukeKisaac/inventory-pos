import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import POSScreen from "../pages/POSScreen";
import Inventory from "../pages/Inventory";
import Reports from "../pages/Reports";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/pos" element={<POSScreen />} />
          <Route path="/products" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}
