import React, { useState } from "react";
// import './CalendarView.css'; // Create a CSS file for styling

const CalendarView = ({ tasks, currentDay }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Get the first day of the current month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get the last day of the current month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Create an array of dates for the current month
  const allDates = getDates(firstDayOfMonth, lastDayOfMonth);

  return (
    <section className="mr-12">
      <div className="flex items-center justify-center">
        <button
          onClick={goToPreviousMonth}
          className="font-bold text-accent text-lg"
        >
          &lt;
        </button>
        <span className="font-bold text-accent text-lg">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={goToNextMonth}
          className="font-bold text-accent text-lg"
        >
          &gt;
        </button>
      </div>
      <div className="flex gap-8 bg-primary rounded-xl flex-wrap p-2">
        {allDates.map((date) => (
          <div
            key={date.toISOString()}
            className={`calendar-day border-l-4 border-accent`}
          >
            <span className="font-bold flex flex-col gap-y-1">
              <span className="text-2xl font-bold text-text">
                {date.getDate()}
              </span>
              <span className="text-xs text-text font-mono">
                {date.toLocaleDateString("en-US", { weekday: "long" })}
              </span>
            </span>
            <div className="">
              {tasks
                .filter(
                  (task) =>
                    isSameDay(new Date(task.task_date), date) &&
                    task.task_completed === false
                )
                .map((task) => (
                  <div
                    key={task._id}
                    className="grid grid-cols-2 space-x-2  w-[140%] -ml-1 p-2 place-items-center rounded-md mb-2 bg-background"
                  >
                    <span className="text-[10px] font-bold uppercase text-text flex gap-x-0.5 items-center ">
                      <div
                        className={`${
                          task.task_date === currentDay &&
                          task.task_completed === false
                            ? "bg-yellow-400"
                            : task.task_date < currentDay &&
                              task.task_completed === false
                            ? "bg-red-400"
                            : "bg-primary"
                        } h-2 w-2`}
                      />
                      {task.task_name}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-text">
                      {task.task_category}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Function to get an array of dates between start and end dates
const getDates = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Function to check if a date has tasks
// const dateIsTask = (date, tasks) => {
//   return tasks.some((task) => isSameDay(new Date(task.task_date), date));
// };

// Function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export default CalendarView;
