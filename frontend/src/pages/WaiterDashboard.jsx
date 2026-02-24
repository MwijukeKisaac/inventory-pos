import { useEffect, useState } from "react";
import { socket, joinRoleRoom } from "../utils/socket";
import { playSound } from "../utils/sound";
import toast, { Toaster } from "react-hot-toast";
import axios from "../api/axiosInstance";

function WaiterDashboard() {
    const [orders, setOrders] = useState([]);
    const branchId = localStorage.getItem("branchId");

    useEffect(() => {
        joinRoleRoom("Waiter", branchId);
        fetchOrders();

        socket.on("newOrder", (order) => {
            playSound("new-order.mp3");
            toast.success(`New QR Order: ${order.orderNumber}`);
            fetchOrders();
        });

        socket.on("orderPaid", (order) => {
            fetchOrders();
        });

        return () => {
            socket.off("newOrder");
            socket.off("orderPaid");
        };
    }, [branchId]);

    const fetchOrders = async () => {
        const res = await axios.get("/orders/pending");
        setOrders(res.data);
    };

    const confirmOrder = async (id) => {
        await axios.put(`/orders/confirm/${id}`);
        fetchOrders();
    };

    return (
        <div className="waiter-dashboard">
            <Toaster position="top-right" />
            <h1>Waiter Dashboard</h1>
            {orders.map(o => (
                <div key={o.id}>
                    <span>{o.orderNumber}</span>
                    <button onClick={() => confirmOrder(o.id)}>Confirm</button>
                </div>
            ))}
        </div>
    );
}

export default WaiterDashboard;
