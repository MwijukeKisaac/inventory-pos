import { useEffect, useState } from "react";
import api from "../services/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/audit-logs").then(res => setLogs(res.data));
  }, []);

  return (
    <div>
      <h2>🔐 Audit Logs</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Details</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.name || "Unknown"}</td>
              <td>{l.user_role}</td>
              <td>{l.action}</td>
              <td>{l.details}</td>
              <td>{new Date(l.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
