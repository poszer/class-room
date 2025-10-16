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
  const API_URL = "https://medipe2.psu.ac.th:3000/api/bookings"
  //const API_URL = "http://127.0.0.1:8080/api/bookings";

  // 🎨 สีประจำห้อง (ให้ตรงกับชื่อห้องใน DB)
  const roomColors = {
    "Classroom 1": "#147253ff",  
    "Classroom 2": "#eecb32ff",  
    "Meeting room": "#ea6d6dff", 
    default: "#6c757d",          
  };

  // 🧭 แปลงวันที่ + เวลา (จาก backend) เป็น Local Date
  const makeLocalDate = (dateString, timeStr) => {
    const baseDate = new Date(dateString);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const day = baseDate.getDate();
    const [hh, mm, ss = "00"] = timeStr.split(":").map(Number);
    return new Date(year, month, day, hh, mm, ss);
  };

  // ✅ โหลดข้อมูลการจองจาก API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setAllBookings(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching bookings:", err);
      });
  }, []);

  // ✅ กรองข้อมูลตามห้องที่เลือก แล้วแปลงเป็น Event
  useEffect(() => {
    const filtered =
      selectedRooms.length === 0
        ? allBookings
        : allBookings.filter((item) =>
            selectedRooms.includes(item.room_name.trim())
          );

    const events = filtered.map((item) => {
      let bgColor = roomColors[item.room_name] || roomColors.default;
      let textColor = "#ffffff";

      // 🟡 สีตามสถานะ
      if (item.status === "pending") {
        bgColor = "#000000";  // เหลืองอ่อน
        textColor = "#000000";
      } else if (item.status === "rejected") {
        bgColor = "#e1e1e1";  // เทาอ่อน
        textColor = "#ff0000";
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

  // ✅ scroll ไปยังเวลาปัจจุบันอัตโนมัติ
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
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        height="90vh"
        events={bookings}
        displayEventTime={false}
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
        timeZone={"local"}   // ✅ อยู่ใน props ของ FullCalendar
        nowIndicator={true}  // ✅ เส้นบอกเวลาปัจจุบัน
        navLinks={true}      // ✅ คลิกวันที่เพื่อเปลี่ยน view ได้
      />
    </div>
  );
}

export default CalendarView;
