import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // ✅ ต้องอยู่ก่อนใช้ process.env

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,  // ✅ สำคัญ
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database:", process.env.DB_NAME);
  }
});
