import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";


function BookingModal({ onClose, onSuccess }) {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [userCode, setUserCode] = useState("");
  const [purpose, setPurpose] = useState("");
  const [detail, setDetail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const API_BOOKINGS = "http://127.0.0.1:8080/api/bookings";
  const API_ROOMS = "http://127.0.0.1:8080/api/rooms";

  // ✅ โหลดรายชื่อห้องเรียน
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(API_ROOMS);
        setRooms(res.data);
      } catch (err) {
        console.error("❌ Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomId || !bookingDate || !startTime || !endTime) {
      alert("⚠️ กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      await axios.post(API_BOOKINGS, {
        room_id: roomId,
        user_name: userName,
        user_code: userCode,
        purpose,
        detail,
        date: bookingDate,
        start_time: startTime,
        end_time: endTime,
      });
      alert("✅ Successfully reserved a classroom!!");
      onSuccess();
    } catch (err) {
      console.error("❌ Error creating booking:", err);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>📅 Book Classroom</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          {/* ห้องเรียน */}
          <Form.Group className="mb-3">
            <Form.Label>Classroom</Form.Label>
            <Form.Select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            >
              <option value="">-- Select a classroom --</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (จุ {room.capacity} คน) - {room.location}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* วันที่ */}
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              lang="en"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
            />
          </Form.Group>

          {/* เวลาเริ่ม - เวลาสิ้นสุด */}
          <Form.Group className="mb-3 d-flex gap-2">
            <div className="flex-fill">
              <Form.Label>Start time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex-fill">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </Form.Group>

          {/* ผู้จอง */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Such as Mr. Somchai Jaidee"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="text"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Such PSU1234"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Objective</Form.Label>
            <Form.Control
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            📝 Confirm
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default BookingModal;
