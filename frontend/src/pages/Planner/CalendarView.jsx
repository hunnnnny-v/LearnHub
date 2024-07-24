import React, { useState } from "react";
// import './CalendarView.css'; // Create a CSS file for styling
import { ChevronRight, ChevronLeft } from "lucide-react";

const CalendarView = ({ tasks, currentDay, fullday }) => {
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
    <section className="font-poppins bg-secondary p-4 rounded-xl">
      <section className="flex items-center justify-center gap-x-2">
        <button
          onClick={goToPreviousMonth}
          className="bg-primary rounded-full text-accent p-1"
        >
          <ChevronLeft />
        </button>
        <span className="font-bold text-lg uppercase text-text">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={goToNextMonth}
          className="bg-primary rounded-full text-accent p-1"
        >
          <ChevronRight />
        </button>
      </section>

      <section className="mt-4">
        <div className="grid grid-cols-4 place-items-center ">
          {allDates.map((date, i) => (
            <div
              key={date.toISOString()}
              className={`flex flex-col items-center h-28 w-60 border-l-4   border-accent mt-2 ${
                (i + 1) % 4 === 0 && "border-r-4 border-accent "
              } relative`}
            >
              <span
                className={`text-3xl font-bold text-accent  ${
                  currentDay === date.getDate() &&
                  new Date().getMonth() === date.getMonth() &&
                  tasks.filter((task) => {
                    if (
                      task.task_date === fullday &&
                      task.task_completed !== true
                    ) {
                      console.log(task.task_date, fullday, task.task_completed);
                      return true; // Include the task in the filtered array
                    }
                    return false; // Exclude the task from the filtered array
                  }).length > 0
                    ? "text-red-400 animate-bounce"
                    : ""
                }`}
              >
                {date.getDate()}
              </span>
              <span
                className={`font-semibold  ${
                  currentDay === date.getDate() &&
                  new Date().getMonth() === date.getMonth() &&
                  tasks.filter((task) => {
                    if (
                      task.task_date === fullday &&
                      task.task_completed !== true
                    ) {
                      console.log(task.task_date, fullday, task.task_completed);
                      return true; // Include the task in the filtered array
                    }
                    return false; // Exclude the task from the filtered array
                  }).length > 0
                    ? "text-red-400 animate-bounce"
                    : "text-text"
                }`}
              >
                {date.toLocaleDateString("en-US", { weekday: "long" })}
              </span>
              <div className="grid grid-cols-2 items-start w-full place-items-center gap-y-1">
                {tasks
                  .filter((task) => isSameDay(new Date(task.task_date), date))
                  .map((task) => (
                    <>
                      {tasks.filter((task) => !task.task_completed).length !==
                        0 && (
                        <div className="h-8 w-16 bg-red-400 absolute top-0 left-2 flex flex-col items-center justify-center rounded-md text-text">
                          <p className="text-xs">Pending</p>
                          <span className="text-xs font-bold">
                            {
                              tasks.filter(
                                (task) =>
                                  isSameDay(new Date(task.task_date), date) &&
                                  task.task_completed === false
                              ).length
                            }
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-x-1">
                        {" "}
                        <div
                          className={`${
                            task.task_completed === false
                              ? "bg-yellow-400"
                              : task.task_date < fullday &&
                                task.task_completed === false
                              ? "bg-red-400"
                              : "bg-emerald-400"
                          } h-3 w-3`}
                        />
                        <span className="flex items-center">
                          <span
                            className={`${
                              task.task_completed === true ? "line-through" : ""
                            } text-xs font-semibold text-text`}
                          >
                            {task.task_name}
                          </span>
                        </span>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
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
