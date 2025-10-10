import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

function CalendarView({ selectedRooms }) {
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const calendarRef = useRef(null);

  const API_URL = "http://127.0.0.1:8080/api/bookings";

  // 🎨 สีประจำห้อง
  const roomColors = {
    "Room A": "#147253ff",
    "Room B": "#eecb32ff",
    "Room C": "#ea6d6dff",
    default: "#6c757d",
  };

  // 🧭 แปลงวันที่ UTC → Local
  const makeLocalDate = (utcString, timeStr) => {
    const utcDate = new Date(utcString);
    const year = utcDate.getFullYear();
    const month = utcDate.getMonth();
    const day = utcDate.getDate();
    const [hh, mm, ss = "00"] = timeStr.split(":").map(Number);
    return new Date(year, month, day, hh, mm, ss);
  };

  // ✅ โหลดข้อมูลจาก API
  useEffect(() => {
    axios.get(API_URL).then((res) => {
      setAllBookings(res.data);
    });
  }, []);

  // ✅ แปลงข้อมูลการจอง → Event
  useEffect(() => {
    const filtered = allBookings.filter((item) =>
      selectedRooms.includes(item.room_name.replace("ห้อง", "Room").trim())
    );

    const events = filtered.map((item) => {
      let bgColor = roomColors[item.room_name] || roomColors.default;
      let textColor = "#fff";

      // 🟡 Pending → พื้นหลังเหลือง ตัวหนังสือดำ
      if (item.status === "pending") {
        bgColor = "#5c5c5aff"; // ✅ สีเหลืองอ่อน (แบบไฮไลท์)
        textColor = "#ffffffff";  // 🖤 ตัวหนังสือสีดำ
      } else if (item.status === "rejected") {
        bgColor = "#e1e505ff"; // เทาอ่อน
        textColor = "#fe0000ff";
      }

      return {
        id: item.id,
        title: `${item.room_name} ${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}`,
        start: makeLocalDate(item.date, item.start_time),
        end: makeLocalDate(item.date, item.end_time),
        backgroundColor: bgColor,
        borderColor: bgColor,
        textColor: textColor,
      };
    });

    setBookings(events);
  }, [selectedRooms, allBookings]);

  // ✅ scroll ไปยังเวลาปัจจุบัน
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const now = new Date();
      calendarApi.scrollToTime(`${now.getHours()}:00:00`);
    }
  }, []);

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // 🗓️ เริ่มต้นที่มุมมองเดือน
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        height="90vh"
        events={bookings}
        displayEventTime={false} // ⬅️ ไม่โชว์เวลาอัตโนมัติด้านหน้า
        allDaySlot={false}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        dateClick={null}
        timeZone="local"
      />
    </div>
  );
}

export default CalendarView;
