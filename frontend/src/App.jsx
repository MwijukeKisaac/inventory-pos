import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Login from "./pages/Login";
import OwnerDashboard from "./pages/OwnerDashboard";
import WaiterDashboard from "./pages/WaiterDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import CustomerOrder from "./pages/CustomerOrder";

function App() {
    const token = localStorage.getItem("token");

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/owner" element={token ? <OwnerDashboard /> : <Navigate to="/login" />} />
                <Route path="/waiter" element={token ? <WaiterDashboard /> : <Navigate to="/login" />} />
                <Route path="/cashier" element={token ? <CashierDashboard /> : <Navigate to="/login" />} />
                <Route path="/manager" element={token ? <ManagerDashboard /> : <Navigate to="/login" />} />
                <Route path="/order/:qrToken" element={<CustomerOrder />} />
            </Routes>
        </Router>
    );
}

export default App;
