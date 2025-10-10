import React, { useState } from "react";
import CalendarView from "./components/CalendarView";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import BookingModal from "./components/BookingModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Modal, Button, Form } from "react-bootstrap";  // ✅ modal สำหรับ admin

function App() {
  // 🧭 state หลัก
  const [view, setView] = useState("user");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [openBookingModal, setOpenBookingModal] = useState(false);

  // 🔐 สำหรับ admin login
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // 📥 ดึงรหัสผ่านจาก .env (ต้องเริ่มต้นด้วย VITE_)
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  // ✅ ฟังก์ชันเช็ครหัสผ่าน
  const handleAdminAccess = () => {
    console.log("Input:", adminCode);
    console.log("Env:", ADMIN_PASSWORD);

    if (adminCode === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setView("admin");
      setShowAdminModal(false);
      setAdminCode("");
    } else {
      alert("❌ Incorrect password, please contact admin");
    }
  };

  // ✅ ฟังก์ชันออกจากระบบแอดมิน
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setView("user");
  };

  return (
    <div className="app-layout">
      {/* 🧭 Sidebar */}
      <Sidebar
        selectedRooms={selectedRooms}
        setSelectedRooms={setSelectedRooms}
        onOpenBookingModal={() => setOpenBookingModal(true)}
        view={view}
        setView={(v) => {
          // 👉 ถ้าจะเข้า admin แต่ยังไม่ล็อกอินให้เปิด modal
          if (v === "admin" && !isAdminLoggedIn) {
            setShowAdminModal(true);
          } else {
            setView(v);
          }
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogout={handleAdminLogout}
      />

      {/* 🗓️ พื้นที่หลัก */}
      <main>
        {view === "user" && <CalendarView selectedRooms={selectedRooms} />}
        {view === "admin" && <AdminDashboard />}
      </main>

      {/* 📝 Modal จองห้องเรียน */}
      {openBookingModal && (
        <BookingModal
          onClose={() => setOpenBookingModal(false)}
          onSuccess={() => setOpenBookingModal(false)}
        />
      )}

      {/* 🔐 Modal ใส่รหัส Admin */}
      <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔐 Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Admin Password</Form.Label>
            <Form.Control
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Enter Admin Password"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdminModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdminAccess}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
