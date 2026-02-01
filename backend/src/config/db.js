import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventory_pos_system"
});

export default db;
