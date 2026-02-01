import { Link } from "react-router-dom";

export default function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <div className="w-60 h-screen bg-gray-900 text-white p-4">
      <h2 className="font-bold mb-6">POS System</h2>

      {role === "ADMIN" && (
        <Link className="block mb-2" to="/admin">
          📊 Dashboard
        </Link>
      )}

      {role !== "CUSTOMER" && (
        <Link className="block mb-2" to="/pos">
          🧾 POS
        </Link>
      )}
    </div>
  );
}
