import db from "../config/db.js";

export async function logAudit({
  userId,
  role,
  action,
  details,
  ip,
}) {
  await db.query(
    `INSERT INTO audit_logs 
     (user_id, user_role, action, details, ip_address)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, role, action, details, ip]
  );
}
