import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 🧭 Import Routes และ DB
import bookingRoutes from "./routes/bookingRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { db } from "./db/connection.js";

// 🌿 โหลด environment variables
dotenv.config();

// 🚀 สร้าง app
const app = express();

// 🧾 Middleware สำหรับ Debug Log
app.use((req, res, next) => {
  console.log(`👉 [${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// 🌐 ตั้งค่า CORS
app.use(cors({
  origin: "*", // ถ้าระบุ domain ได้จะปลอดภัยกว่า
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// 📦 ให้ Express อ่าน JSON ได้
app.use(express.json());

// 🛠️ Routes
app.use("/api/bookings", bookingRoutes); // ✅ เส้นทางหลักสำหรับระบบจอง
app.use("/api/rooms", roomRoutes);       // ✅ เส้นทางห้องเรียน

// 🧪 Test Route
app.get("/", (req, res) => {
  res.send("📚 Classroom Booking API is running!");
});

// 🧭 เชื่อมต่อฐานข้อมูล (optional check)
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log(`✅ Connected to MySQL database: ${process.env.DB_NAME}`);
  }
});

// 🖥️ เริ่มรันเซิร์ฟเวอร์
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
