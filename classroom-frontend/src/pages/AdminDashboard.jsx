import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Badge, Form } from "react-bootstrap";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("");
  const API_URL = "http://127.0.0.1:8080/api/bookings";

  // ✅ โหลดข้อมูลทั้งหมด
  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_URL);
      setBookings(res.data);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ อัปเดตสถานะ
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, { status });
      alert(`✅ Status updated to ${status}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update status");
    }
  };

  // ✅ Badge ตามสถานะ
  const getBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge bg="success">Approved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return (
          <Badge bg="warning" text="dark">
            Pending
          </Badge>
        );
    }
  };

  // ✅ Filter ข้อมูลตามสถานะ
  const filteredBookings = bookings.filter((b) =>
    filter ? b.status === filter : true
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="mb-3">🧑‍💼 All Room Booking Requests</h4>

      {/* 🔸 Dropdown Filter */}
      <Form.Select
        className="mb-3"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">-- Show All --</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </Form.Select>

      {/* 🔸 ตาราง */}
      <Table striped bordered hover responsive>
        <thead className="table-light">
          <tr className="text-center">
            <th>#</th>
            <th>Room</th>
            <th>Booked By</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b, i) => (
              <tr key={b.id} className="align-middle text-center">
                <td>{i + 1}</td>
                <td>{b.room_name}</td>
                <td className="text-start">
                  <strong>{b.user_name}</strong> <br />
                  <small className="text-muted">{b.user_code}</small>
                </td>
                <td>{b.date}</td>
                <td>
                  {b.start_time.slice(0, 5)} - {b.end_time.slice(0, 5)}
                </td>
                <td>{getBadge(b.status)}</td>
                <td>
                  {b.status === "pending" ? (
                    <div className="action-btn-wrapper">
                      <Button
                        variant="success"
                        size="sm"
                        className="action-btn"
                        onClick={() => updateStatus(b.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="action-btn"
                        onClick={() => updateStatus(b.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <small className="text-muted">-</small>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminDashboard;
