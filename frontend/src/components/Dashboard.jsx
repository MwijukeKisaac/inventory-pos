import { useEffect } from "react";
import { socket, joinRoleRoom } from "../utils/socket";
import { playSound } from "../utils/sound";
import toast from "react-hot-toast";

function Dashboard({ role }) {

    useEffect(() => {
        joinRoleRoom(role);

        socket.on("newOrder", (data) => {
            playSound("new-order.mp3");
            toast.success("New QR Order Received!");
        });

        socket.on("orderConfirmed", () => {
            playSound("confirmed.mp3");
        });

        socket.on("orderPaid", () => {
            playSound("payment.mp3");
        });

        socket.on("lowStock", () => {
            playSound("alert.mp3");
        });

        return () => {
            socket.off("newOrder");
            socket.off("orderConfirmed");
            socket.off("orderPaid");
            socket.off("lowStock");
        };

    }, [role]);

    return <div>Dashboard</div>;
}

export default Dashboard;
