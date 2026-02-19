import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "inventory_pos_system"
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    console.error("Make sure your MySQL credentials are set in a .env file or environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME).");
  } else {
    console.log("Connected to MySQL database");
  }
});

export default connection;