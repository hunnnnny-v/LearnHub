import React, { useState } from "react";

const CalendarX = () => {
  const [date, setDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = () =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendar = () => {
    const totalDays = daysInMonth(date.getFullYear(), date.getMonth());
    const startingDay = firstDayOfMonth();
    const calendar = [];

    // Fill in the days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      calendar.push(null);
    }

    // Fill in the days of the month
    for (let i = 1; i <= totalDays; i++) {
      calendar.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return calendar;
  };

  const nextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  };

  const prevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  };

  const calendar = generateCalendar();

  return (
    <div>
      <div>
        <button onClick={prevMonth}>&lt;</button>
        <span>
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {calendar.map((day, index) =>
            index % 7 === 0 ? (
              <tr key={index}></tr>
            ) : (
              <td key={index}>{day ? day.getDate() : ""}</td>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarX;
