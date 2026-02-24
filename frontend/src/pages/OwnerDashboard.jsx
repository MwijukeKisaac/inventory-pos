import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { socket, joinRoleRoom } from "../utils/socket";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { playSound } from "../utils/sound";
import toast, { Toaster } from "react-hot-toast";

function OwnerDashboard() {
    const [stats, setStats] = useState({});
    const [chartData, setChartData] = useState([]);
    const branchId = "all";

    useEffect(() => {
        joinRoleRoom("Owner", branchId);
        fetchStats();
        fetchChart();

        socket.on("dashboardUpdate", (data) => {
            playSound("payment.mp3");
            toast.success("Dashboard Updated!");
            fetchStats();
        });

        return () => socket.off("dashboardUpdate");
    }, []);

    const fetchStats = async () => {
        const res = await axios.get("/analytics/stats");
        setStats(res.data);
    };

    const fetchChart = async () => {
        const res = await axios.get("/analytics/sales-chart");
        setChartData(res.data);
    };

    return (
        <div className="dashboard">
            <Toaster position="top-right" />
            <h1>Owner Dashboard</h1>
            <div>
                <h2>Total Sales: ${stats.totalSales}</h2>
                <h3>Today's Sales: ${stats.todaySales}</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default OwnerDashboard;
