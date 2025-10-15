import React, { useEffect } from "react";
import { Button } from "react-bootstrap";

function Sidebar({
  selectedRooms,
  setSelectedRooms,
  onOpenBookingModal,
  view,
  setView,
}) {
  const rooms = ["Classroom 1", "Classroom 2", "Meeting room"]; // ✅ รายชื่อห้อง

  // ✅ ติ๊ก Select All อัตโนมัติเมื่อเปิดหน้า
  useEffect(() => {
    setSelectedRooms(rooms);
  }, []);

  // ✅ toggle single room
  const handleToggleRoom = (room) => {
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  // ✅ toggle select all
  const handleSelectAll = () => {
    if (selectedRooms.length === rooms.length) {
      setSelectedRooms([]); // ✅ ถ้าติ๊กครบแล้ว → ยกเลิกทั้งหมด
    } else {
      setSelectedRooms(rooms); // ✅ ถ้ายังไม่ครบ → เลือกทั้งหมด
    }
  };

  return (
    <aside className="sidebar-layout">
      {/* ============================= */}
      {/* 🧭 Top Section - Room Filter */}
      {/* ============================= */}
      {view === "user" && (
        <div className="sidebar-top">
          <Button
            variant="success"
            className="w-100 mb-3"
            onClick={onOpenBookingModal}
          >
            ➕ Book Classroom
          </Button>

          <h5>Room Filter</h5>
          <div className="filter-item">
            <input
              type="checkbox"
              checked={selectedRooms.length === rooms.length}
              onChange={handleSelectAll}
            />
            <label className="ms-2">Select All</label>
          </div>

          {rooms.map((room) => (
            <div className="filter-item" key={room}>
              <input
                type="checkbox"
                checked={selectedRooms.includes(room)}
                onChange={() => handleToggleRoom(room)}
              />
              <label className="ms-2">{room}</label>
            </div>
          ))}
        </div>
      )}

      {/* ============================= */}
      {/* 🟦 Bottom Section - Page Switch */}
      {/* ============================= */}
      <div className="sidebar-bottom mt-4">
        <Button
          variant={view === "user" ? "primary" : "outline-primary"}
          className="w-100 mb-2"
          onClick={() => setView("user")}
        >
          User
        </Button>
        <Button
          variant={view === "admin" ? "primary" : "outline-primary"}
          className="w-100"
          onClick={() => setView("admin")}
        >
          Admin
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
