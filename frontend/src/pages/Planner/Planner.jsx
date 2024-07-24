import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  AlarmClock,
  BellRing,
  Binary,
  Calendar,
  Check,
  Cross,
  GanttChartSquare,
  MoveDownRight,
  PencilLine,
  Shell,
  Trash2,
} from "lucide-react";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import CalendarView from "./CalendarView";

const Planner = ({ isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [isOpenAddTask, setIsOpenAddTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const { userId } = useAuth();
  const [incompleteTasks, setIncompletedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const uniqueCategories = new Set();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();
  const currentDay = `${currentYear}-${currentMonth}-${currentDate}`;
  const [type, setType] = useState("default");
  const [seggregatedCompletedTasks, setSeggregatedCompletedTasks] = useState(
    []
  );
  const [seggregatedIncompleteTasks, setSeggregatedIncompleteTasks] = useState(
    []
  );

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/task/${userId}`)
      .then((res) => {
        setIncompletedTasks(
          res.data.filter((task) => task.task_completed === false)
        );
        setCompletedTasks(
          res.data.filter((task) => task.task_completed === true)
        );
        setAllTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log(taskName, taskCategory, taskDate);

    if (taskDate < currentDay) {
      enqueueSnackbar("You can't add a task on days prior to today", {
        variant: "info",
      });
      return;
    }
    setLoading(true);

    axios
      .post("http://localhost:5555/task", {
        user_id: userId,
        task_name: taskName,
        task_date: taskDate,
        task_category:
          taskCategory.length === 0 ? "" : taskCategory.toUpperCase(),
        task_completed: false,
      })
      .then(() => {
        enqueueSnackbar("Task successfully added", { variant: "success" });
        // setLoading(false);
        axios.get(`http://localhost:5555/task/${userId}`).then((res) => {
          setIncompletedTasks(
            res.data.filter((task) => task.task_completed === false)
          );
          setCompletedTasks(
            res.data.filter((task) => task.task_completed === true)
          );
          setAllTasks(res.data);

          setLoading(false);
        });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Task was not added", { variant: "error" });
        setLoading(false);
      })
      .finally(() => {
        setTaskDate("");
        setTaskCategory("");
        setTaskName("");
      });
  };

  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/task/${id}`)
      .then((res) => {
        enqueueSnackbar("Task Successfully Deleted", { variant: "success" });
        // setLoading(false);
        axios.get(`http://localhost:5555/task/${userId}`).then((res) => {
          setIncompletedTasks(
            res.data.filter((task) => task.task_completed === false)
          );
          setCompletedTasks(
            res.data.filter((task) => task.task_completed === true)
          );
          setAllTasks(res.data);

          setLoading(false);
        });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Error Deleting Task", { variant: "error" });
        setLoading(false);
      });
  };

  const handleCompletion = (id) => {
    setLoading(true);
    axios
      .put(`http://localhost:5555/task/${id}`, {
        task_completed: true,
        task_completed_on: currentDay,
      })
      .then(() => {
        enqueueSnackbar("Task Completed Successfully", { variant: "success" });
        enqueueSnackbar(
          "Completed tasks are not deleted they are stored in your completed task list!",
          { variant: "info" }
        );
        axios.get(`http://localhost:5555/task/${userId}`).then((res) => {
          setIncompletedTasks(
            res.data.filter((task) => task.task_completed === false)
          );
          setCompletedTasks(
            res.data.filter((task) => task.task_completed === true)
          );
          setAllTasks(res.data);

          setLoading(false);
        });
      })
      .catch((err) => {
        enqueueSnackbar("Error marking task as completed", {
          variant: "error",
        });
        setLoading(false);
        console.log(err);
      });
  };

  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDate, setEditTaskDate] = useState("");
  const [editTaskCategory, setEditTaskCategory] = useState("");
  const [editTaskId, setEditTaskId] = useState("");

  const handleEdit = (id) => {
    setIsEditing(true);

    axios.get(`http://localhost:5555/task/edit/${id}`).then((res) => {
      setEditTaskName(res.data.task_name);
      setEditTaskCategory(res.data.task_category);
      setEditTaskDate(res.data.task_date);
      setEditTaskId(res.data._id);
    });
  };

  const editTask = (id) => {
    if (taskDate < currentDay) {
      enqueueSnackbar("You can't add a task on days prior to today", {
        variant: "info",
      });
      return;
    }

    axios
      .put(`http://localhost:5555/task/${id}`, {
        task_name: editTaskName,
        task_date: editTaskDate,
        task_category: editTaskCategory,
      })
      .then(() => {
        enqueueSnackbar("Task edited Successfully", { variant: "success" });
        axios.get(`http://localhost:5555/task/${userId}`).then((res) => {
          setIncompletedTasks(
            res.data.filter((task) => task.task_completed === false)
          );
          setCompletedTasks(
            res.data.filter((task) => task.task_completed === true)
          );
          setAllTasks(res.data);

          setIsEditing(false);
        });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Error editing task", { variant: "error" });
      });
  };

  allTasks.forEach((task) => {
    uniqueCategories.add(task.task_category);
  });

  const uniqueCategoriesArray = Array.from(uniqueCategories);

  const handleSeggregation = (category_name) => {
    if (selectedCategory === category_name) {
      enqueueSnackbar(`Already seggreated according to ${category_name}!`, {
        variant: "info",
      });
      return;
    }

    setLoading(true);
    setType("unset");
    setSelectedCategory(category_name);
    setShowCompletedTasks(true);
    axios
      .get(`http://localhost:5555/task/find/${category_name}`)
      .then((res) => {
        setSeggregatedCompletedTasks(
          res.data.filter(
            (task) => task.user_id === userId && task.task_completed === true
          )
        );
        setSeggregatedIncompleteTasks(
          res.data.filter(
            (task) => task.user_id === userId && task.task_completed === false
          )
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const refresh = () => {
    setType("default");
    setSelectedCategory("ALL");
  };

  const [isCalendarView, setCalendarView] = useState(false);

  return (
    <div
      className={`mt-24 min-h-screen font-poppins   mr-4 mb-10 ${
        !isOpen ? "max-w-7xl mx-auto" : "w-full"
      }`}
    >
      <section className="text-text flex flex-col gap-y-2">
        <h1 className="flex gap-x-2 items-center text-2xl font-bold">
          <AlarmClock className="h-8 w-8 text-accent" />
          Your Daily Planner
          <span className="text-background">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.{" "}
            {!isOpen && "Atque rem"}
          </span>
        </h1>
        <p className="text-accent font-sm font-semibold">
          Streamline your daily routine and boost productivity effortlessly
        </p>
      </section>

      <section className="mt-10">
        <div>
          <h1
            className="flex gap-x-2 font-bold text-xl items-center cursor-pointer group text-text"
            onClick={() => setIsOpenAddTask((prev) => !prev)}
          >
            Add a task
            <MoveDownRight className="text-accent group-hover:ml-1.5 transition-all" />
          </h1>
          {isOpenAddTask && (
            <form
              className="grid grid-cols-4 gap-x-2 mr-4"
              onSubmit={(e) => handleSubmit(e)}
            >
              <input
                type="text"
                placeholder="Name..."
                className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm mr-2 placeholder:text-gray-500"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
              <input
                type="date"
                className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm mr-2 placeholder:text-gray-500"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Category..."
                className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm mr-2 placeholder:text-gray-500"
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
              />
              <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2">
                Add Task
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-xl font-bold text-text">
          Seggregate according to your categories
        </h1>
        <div className="flex gap-x-4 items-center justify-center mt-4">
          <div
            className={`bg-primary text-text rounded-full p-2 cursor-pointer ${
              selectedCategory === "ALL" && "bg-red-400"
            }`}
            onClick={refresh}
          >
            <h1 className="text-xs font-semibold">ALL</h1>
          </div>
          {uniqueCategoriesArray.map((category) => (
            <div
              className={`bg-primary text-text rounded-full p-2 cursor-pointer ${
                selectedCategory === category && "bg-red-400"
              }`}
              onClick={() => handleSeggregation(category)}
              key={category}
            >
              <h1 className="text-xs font-semibold">{category}</h1>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl text-text font-bold text-center flex flex-col gap-y-2">
          Incompleted Task's
          <span className="flex flex-col items-center text-sm">
            Each color has a meaning here.
            <span>
              <div className="flex gap-x-3">
                <div className="flex gap-x-1 items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span>Due date of the task is today</span>
                </div>
                <div className="flex gap-x-1 items-center">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <span>Due date of the task has passed</span>
                </div>
                <div className="flex gap-x-1 items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span>Task is not completed but is within due date</span>
                </div>
              </div>
            </span>
          </span>
          {type === "default" && (
            <span className="text-sm font-semibold text-accent">
              Here are all your incompleted tasks! Click on them to edit!
            </span>
          )}
        </h1>

        {isEditing && (
          <section className="mt-10">
            <Cross
              className="text-accent rotate-45 cursor-pointer"
              onClick={() => setIsEditing(false)}
            />
            <form className="grid grid-cols-4 gap-x-2 mr-4">
              <input
                type="text"
                placeholder="Name..."
                className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm mr-2 placeholder:text-gray-500"
                value={editTaskName}
                onChange={(e) => setEditTaskName(e.target.value)}
                required
              />
              <input
                type="date"
                className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm mr-2 placeholder:text-gray-500"
                value={editTaskDate}
                onChange={(e) => setEditTaskDate(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Category..."
                className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm mr-2 placeholder:text-gray-500"
                value={editTaskCategory}
                onChange={(e) => setEditTaskCategory(e.target.value)}
              />
              <button
                className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2"
                onClick={() => editTask(editTaskId)}
                type="button"
              >
                Edit Task
              </button>
            </form>
          </section>
        )}

        {loading && (
          <div className="flex items-center justify-center mt-8">
            <Shell className="h-10 w-10 text-text animate-spin" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4">
            {incompleteTasks.length === 0 && completedTasks.length === 0 && (
              <div className="col-span-4">
                <h1 className="text-center bg-secondary text-accent font-bold tex-2xl p-3">
                  Currently you have no tasks!
                </h1>
              </div>
            )}
            {incompleteTasks.length === 0 && completedTasks.length !== 0 && (
              <div className="col-span-4">
                <h1 className="text-center bg-secondary text-accent font-bold tex-2xl p-3">
                  Currently you have no incompleted tasks!
                </h1>
              </div>
            )}

            {type === "default" &&
              incompleteTasks.map((task) => (
                <div
                  key={task._id}
                  className={`flex flex-col gap-y-2 mt-10 p-2 cursor-pointer relative rounded-md bg-primary ${
                    task.task_date === currentDay &&
                    task.task_completed === false
                      ? "bg-yellow-400 "
                      : task.task_date < currentDay &&
                        task.task_completed === false
                      ? "bg-red-400"
                      : "bg-primary"
                  } hover:scale-105 transition-all`}
                >
                  <GanttChartSquare
                    className={`absolute h-8 w-8 -top-5 -left-3  rounded-full p-2 text-black ${
                      task.task_date === currentDay &&
                      task.task_completed === false
                        ? "bg-yellow-400  animate-bounce hover:animate-none"
                        : task.task_date < currentDay &&
                          task.task_completed === false
                        ? "bg-red-400"
                        : "bg-primary"
                    }`}
                  />

                  <div onClick={() => handleEdit(task._id)}>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <PencilLine className="h-3 w-3" />
                        Task Name
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_name}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <Binary className="h-3 w-3" />
                        Task Category
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_category}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <BellRing className="h-3 w-3" />
                        Task Due Date
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_date}
                      </span>
                    </h1>
                    <h1 className="flex justify-between">
                      <span className="flex flex-col">
                        <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                          <AlarmClock className="h-3 w-3" />
                          Created At
                        </span>
                        <span className="text-xs uppercase font-bold bg-background p-1 text-accent rounded-full text-center">
                          {new Date(task.createdAt).toLocaleTimeString()}
                        </span>
                      </span>
                      {!task.task_completed && (
                        <span className="flex flex-col">
                          <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                            <Calendar className="h-3 w-3" />
                            Created On
                          </span>
                          <span className="text-xs uppercase font-bold bg-background p-1 text-accent rounded-full text-center">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                      )}
                    </h1>
                  </div>
                  <div className="flex items-center justify-around">
                    {!task.task_completed && (
                      <button
                        className="bg-emerald-400 rounded-full p-1 text-text hover:scale-105 transition-all"
                        onClick={() => handleCompletion(task._id)}
                      >
                        <Check />
                      </button>
                    )}
                    <button
                      className="bg-red-400 rounded-full p-1 text-text hover:scale-105 transition-all"
                      onClick={() => handleDelete(task._id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            {type === "unset" &&
              seggregatedIncompleteTasks.map((task) => (
                <div
                  key={task._id}
                  className={`flex flex-col gap-y-2 mt-10 p-2 cursor-pointer relative rounded-md bg-primary ${
                    task.task_date === currentDay &&
                    task.task_completed === false
                      ? "bg-yellow-400 "
                      : task.task_date < currentDay &&
                        task.task_completed === false
                      ? "bg-red-400"
                      : "bg-primary"
                  } hover:scale-105 transition-all`}
                >
                  <GanttChartSquare
                    className={`absolute h-8 w-8 -top-5 -left-3  rounded-full p-2 text-black ${
                      task.task_date === currentDay &&
                      task.task_completed === false
                        ? "bg-yellow-400  animate-bounce hover:animate-none"
                        : task.task_date < currentDay &&
                          task.task_completed === false
                        ? "bg-red-400"
                        : "bg-primary"
                    }`}
                  />

                  <div>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <PencilLine className="h-3 w-3" />
                        Task Name
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_name}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <Binary className="h-3 w-3" />
                        Task Category
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_category}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <BellRing className="h-3 w-3" />
                        Task Due Date
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_date}
                      </span>
                    </h1>
                    <h1 className="flex justify-between">
                      <span className="flex flex-col">
                        <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                          <AlarmClock className="h-3 w-3" />
                          Created At
                        </span>
                        <span className="text-xs uppercase font-bold bg-background p-1 text-accent rounded-full text-center">
                          {new Date(task.createdAt).toLocaleTimeString()}
                        </span>
                      </span>
                      {!task.task_completed && (
                        <span className="flex flex-col">
                          <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                            <Calendar className="h-3 w-3" />
                            Created On
                          </span>
                          <span className="text-xs uppercase font-bold bg-background p-1 text-accent rounded-full text-center">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                      )}
                    </h1>
                  </div>
                </div>
              ))}

            {type === "unset" && seggregatedIncompleteTasks.length === 0 && (
              <div className="col-span-4">
                <h1 className="text-center bg-secondary text-accent font-bold tex-2xl p-3 ">
                  No incomplete task with the selected category
                </h1>
              </div>
            )}
          </div>
        )}
      </section>

      {!loading && (
        <section className="mt-10">
          <h1
            className="text-2xl text-text font-bold text-center flex flex-col gap-y-2 cursor-pointer"
            onClick={() => setShowCompletedTasks((prev) => !prev)}
          >
            Completed Task's
            {showCompletedTasks && (
              <span className="flex flex-col items-center text-sm">
                Each color has a meaning here.
                <span>
                  <div className="flex gap-x-3">
                    <div className="flex gap-x-1 items-center">
                      <GanttChartSquare className="h-5 w-5 bg-emerald-400 p-1 rounded-full" />
                      <span>You completed the task within the due date</span>
                    </div>
                    <div className="flex gap-x-1 items-center">
                      <GanttChartSquare className="h-5 w-5 bg-red-400 p-1 rounded-full" />
                      <span>You completed the task but after the due date</span>
                    </div>
                  </div>
                </span>
              </span>
            )}
            <span className="text-sm font-semibold text-accent">
              Click to {showCompletedTasks === true ? "hide" : "see"} your
              completed tasks
            </span>
          </h1>

          {incompleteTasks.length === 0 && completedTasks.length === 0 && <></>}

          {completedTasks.length === 0 && (
            <div className="col-span-4">
              <h1 className="text-center bg-secondary text-accent font-bold tex-2xl p-3 ">
                Currently you have no completed tasks!
              </h1>
            </div>
          )}

          {showCompletedTasks && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 ">
              {type === "default" &&
                completedTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`flex flex-col gap-y-2 mt-10 p-2 cursor-pointer relative rounded-md bg-primary hover:scale-105 transition-all`}
                  >
                    <GanttChartSquare
                      className={`absolute h-8 w-8 -top-5 -left-3  rounded-full p-2 text-black ${
                        task.task_completed_on > task.task_date
                          ? "bg-red-400"
                          : "bg-emerald-400"
                      }`}
                    />

                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <PencilLine className="h-3 w-3" />
                        Task Name
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_name}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <Binary className="h-3 w-3" />
                        Task Category
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_category}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <BellRing className="h-3 w-3" />
                        Task Due Date
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_date}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <BellRing className="h-3 w-3" />
                        Completed On
                      </span>
                      <span
                        className={`text-lg uppercase font-bold bg-background p-0.5 rounded-r-md ${
                          task.task_completed_on > task.task_date
                            ? "text-red-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {task.task_completed_on}
                      </span>
                    </h1>

                    <div className="flex items-center justify-around">
                      <button
                        className="bg-red-400 rounded-full p-1 text-text hover:scale-105 transition-all"
                        onClick={() => handleDelete(task._id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}
              {type === "unset" &&
                seggregatedCompletedTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`flex flex-col gap-y-2 mt-10 p-2 cursor-pointer relative rounded-md bg-primary hover:scale-105 transition-all`}
                  >
                    <GanttChartSquare
                      className={`absolute h-8 w-8 -top-5 -left-3  rounded-full p-2 text-black ${
                        task.task_completed_on > task.task_date
                          ? "bg-red-400"
                          : "bg-emerald-400"
                      }`}
                    />

                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <PencilLine className="h-3 w-3" />
                        Task Name
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_name}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <Binary className="h-3 w-3" />
                        Task Category
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_category}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <BellRing className="h-3 w-3" />
                        Task Due Date
                      </span>
                      <span className="text-lg uppercase font-bold bg-background p-0.5 text-accent rounded-r-md">
                        {task.task_date}
                      </span>
                    </h1>
                    <h1 className="flex flex-col ">
                      <span className="text-[11px] text-text font-semibold flex gap-x-1 items-center">
                        <BellRing className="h-3 w-3" />
                        Completed On
                      </span>
                      <span
                        className={`text-lg uppercase font-bold bg-background p-0.5 rounded-r-md ${
                          task.task_completed_on > task.task_date
                            ? "text-red-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {task.task_completed_on}
                      </span>
                    </h1>
                  </div>
                ))}

              {type === "unset" && seggregatedCompletedTasks.length === 0 && (
                <div className="col-span-4">
                  <h1 className="text-center bg-secondary text-accent font-bold tex-2xl p-3 ">
                    No completed task with the selected category
                  </h1>
                </div>
              )}
            </div>
          )}
        </section>
      )}
      {!loading && (
        <section className="mt-10 mb-3">
          <div
            className="flex flex-col gap-y-1 cursor-pointer"
            onClick={() => setCalendarView((prev) => !prev)}
          >
            <h1 className="text-xl font-bold text-text flex gap-x-2">
              <Calendar className="text-accent" />
              Here is the calendar view
            </h1>
            <p className="text-xs font-semibold text-accent">
              All your tasks will be shown here on its due date
            </p>
            <p className="text-xs font-semibold text-accent">
              Click to {isCalendarView ? "hide" : "see"} Calendar View{" "}
            </p>
          </div>

          {isCalendarView && (
            <>
              <div className="flex gap-x-3 items-center justify-center mb-3">
                <div className="flex gap-x-0.5 items-center">
                  <div className="h-4 w-4 bg-yellow-400" />
                  <h1 className="text-sm font-semibold text-accent">
                    Task is not completed yet
                  </h1>
                </div>
                <div className="flex gap-x-0.5 items-center">
                  <div className="h-4 w-4 bg-emerald-400" />
                  <h1 className="line-through text-sm font-semibold text-accent">
                    Task is completed
                  </h1>
                </div>
              </div>
              <CalendarView
                tasks={allTasks}
                currentDay={currentDate}
                fullday={currentDay}
              />
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Planner;
