import { useEffect, useState } from "react";
import api from "../services/api";

export default function LowStockAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/alerts").then(res => setAlerts(res.data));
  }, []);

  if (!alerts.length) return null;

  return (
    <div style={{ background:"#ffe6e6", padding:10 }}>
      <h3>⚠ Low Stock Alerts</h3>
      {alerts.map(a => (
        <div key={a.id}>
          {a.name} – Remaining: {a.quantity}
        </div>
      ))}
    </div>
  );
}
