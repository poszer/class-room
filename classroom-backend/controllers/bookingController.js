import { db } from "../db/connection.js";

// ✅ ดึงรายการจองทั้งหมด (รวมชื่อห้อง)
export const getBookings = (req, res) => {
  const sql = `
    SELECT bookings.*, rooms.name AS room_name 
    FROM bookings 
    JOIN rooms ON bookings.room_id = rooms.id
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error fetching bookings:", err);
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
};

// ✅ เพิ่มการจองใหม่
export const createBooking = (req, res) => {
  const { room_id, user_name, user_code, purpose, detail, date, start_time, end_time } = req.body;

  // แปลงวันที่ให้เป็นรูปแบบที่ MySQL ยอมรับ (YYYY-MM-DD)
  const pureDate = date.split("T")[0];

  // ตรวจสอบว่าห้องนี้มีการจองช่วงเวลานี้แล้วหรือยัง
  const checkQuery = `
    SELECT * FROM bookings 
    WHERE room_id = ? AND date = ? 
    AND (
      (start_time <= ? AND end_time > ?) OR
      (start_time < ? AND end_time >= ?)
    )
  `;

  db.query(
    checkQuery,
    [room_id, pureDate, start_time, start_time, end_time, end_time],
    (err, results) => {
      if (err) {
        console.error("❌ Error checking booking:", err);
        return res.status(500).json({ message: "Server error (check)" });
      }

      // ถ้ามีการจองช่วงเวลานี้แล้ว
      if (results.length > 0) {
        console.warn("⚠️ Duplicate booking detected:", results);
        return res.status(400).json({ message: "ช่วงเวลานี้ถูกจองแล้ว" });
      }

      // ถ้าไม่มีการจองซ้ำ → INSERT ปกติ
      const insertQuery = `
        INSERT INTO bookings (room_id, user_name, user_code, purpose, detail, date, start_time, end_time, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `;

      db.query(
        insertQuery,
        [room_id, user_name, user_code, purpose, detail, pureDate, start_time, end_time],
        (err, result) => {
          if (err) {
            console.error("❌ Error creating booking:", err);
            return res.status(500).json({ message: "Server error (insert)" });
          }
          console.log("✅ Booking created successfully:", result.insertId);
          res.json({ message: "✅ จองห้องเรียนสำเร็จ!" });
        }
      );
    }
  );
};

// ✅ อัปเดตสถานะการจอง
export const updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE bookings SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("❌ Error updating status:", err);
      return res.status(500).json({ error: err });
    }

    console.log(`🟢 Booking #${id} updated to: ${status}`);
    res.json({ message: `🟢 Booking ${status} successfully!` });
  });
};
