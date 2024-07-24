import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
  ActivitySquare,
  BadgeInfo,
  Banknote,
  DatabaseZap,
  FlaskRound,
  ScrollText,
  Shell,
  StickyNote,
} from "lucide-react";
import { useEffect, useState } from "react";
import Clock from "./_components/Clock";
import { NavLink } from "react-router-dom";
import News from "./_components/News";

const Home = ({ isOpen }) => {
  const { userId } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [userAssignments, setUserAssignments] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/students")
      .then((res) => {
        setStudents(res.data);

        axios
          .get("http://localhost:5555/subjects")
          .then((res) => {
            setSubjects(res.data);
            // setLoading(false);
            axios
              .get("http://localhost:5555/notes")
              .then((res) => {
                setAllNotes(res.data);
                // setLoading(false);
                axios.get("http://localhost:5555/assignments").then((res) => {
                  setUserAssignments(
                    res.data.filter(
                      (assignment) => assignment.teacher_id === userId
                    )
                  );
                  setLoading(false);
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  let count = students.filter((student) => student.teacher_id === userId);
  const uniqueSubjectNames = new Set();

  subjects
    .filter((subject) => subject.teacher_id === userId)
    .forEach((subject) => {
      uniqueSubjectNames.add(subject.subject_name);
    });

  const uniqueSubjectsArray = Array.from(uniqueSubjectNames);
  let userNotes = allNotes.filter((notes) => notes.teacher_id === userId);
  userNotes = userNotes.slice(0, 3);

  // todays day and date
  const today = new Date();
  const day = today.toLocaleString("default", { weekday: "short" });
  const date = today.getDate();

  //yesterday's date and day
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.getDate();
  const yesterdayDay = yesterday.toLocaleString("default", {
    weekday: "short",
  });

  // next day and date
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.getDate();
  const tomorrowDay = tomorrow.toLocaleString("default", { weekday: "short" });

  const user = useUser();
  const fullName = user.user.fullName;

  // console.log(userAssignments.slice(0, 2));

  return (
    <main
      className={`mt-24 ${
        !isOpen && "flex flex-col items-center justify-center w-full"
      }`}
    >
      <div className="flex items-center gap-x-2 mb-10">
        <h1 className="font-poppins text-2xl text-text">
          Welcome Back{" "}
          <span className="text-accent font-bold text-4xl">{fullName}</span>
        </h1>
        <div className="bg-white inline-block rounded-full text-center">
          <img src={"/hi.svg"} alt="" className="h-10 w-10" />
        </div>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="bg-secondary w-[300px] rounded-xl flex flex-col">
          <div className="flex items-center justify-between p-3 ">
            <h1 className="font-poppins text-xl text-text">
              Your Enrolled Student's
            </h1>
            <FlaskRound className="h-6 w-6 text-accent" />
          </div>
          <div className="rounded-full bg-secondary border-4 border-accent h-48 w-48 self-center mb-4">
            <div className="flex items-center justify-center h-full">
              <h1 className="font-poppins text-6xl text-text">
                {loading ? <Shell className="animate-spin" /> : count.length}
              </h1>
            </div>
          </div>
          <div className="p-3 font-poppins">
            <div className="flex justify-between items-center">
              <h1 className="text-lg text-text">Enrolled This Week </h1>
              <span className="text-accent font-semibold text-xl">
                {
                  students.filter(
                    (student) =>
                      student.teacher_id === userId &&
                      new Date(student.createdAt).getTime() >
                        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
                  ).length
                }
              </span>
            </div>
            <hr className="mt-2 mb-2 " />
            <div className="flex justify-between items-center">
              <h1 className="text-lg text-text">Enrolled This Month </h1>
              <span className="text-accent font-semibold text-xl">
                {
                  students.filter(
                    (student) =>
                      student.teacher_id === userId &&
                      new Date(student.createdAt).getTime() >
                        new Date().getTime() - 30 * 24 * 60 * 60 * 1000
                  ).length
                }
              </span>
            </div>
          </div>
        </div>
        <div className="bg-primary hidden lg:grid w-[300px]   grid-cols-5 gap-x-16 relative">
          <div className=" w-2 bg-accent" />
          <div className=" w-2 bg-background" />
          <div className=" w-2 bg-background" />
          <div className=" w-2 bg-background" />
          <div className=" w-2 bg-accent" />
          <div className="absolute top-3 flex justify-between items-center">
            <h1 className="font-poppins text-xl text-text ml-2">
              Current Affairs
            </h1>
            <ActivitySquare className="h-6 w-6 text-accent ml-24" />
          </div>
          <News />
        </div>
        <div className="bg-accent w-[300px] rounded-xl flex flex-col p-3">
          <div className="flex justify-between">
            <h1 className="font-poppins text-xl text-text mb-10">
              Time is Money
            </h1>
            <Banknote className="h-6 w-6 text-text" />
          </div>
          <Clock />
          <div className="grid grid-cols-3 gap-x-4 mt-10">
            <div className="border-2 border-primary flex flex-col gap-y-3 items-center justify-center p-4 w-[80px] rounded-full">
              <span className="font-poppins text-lg text-text">
                {yesterdayDay}
              </span>
              <span className="font-semibold text-lg text-text">
                {yesterdayDate}
              </span>
            </div>
            <div className="bg-secondary flex flex-col gap-y-3 items-center justify-center p-4 w-[80px] rounded-full">
              <span className="font-poppins text-lg text-text">{day}</span>
              <span className="font-semibold text-lg text-text">{date}</span>
            </div>
            <div className="border-2 border-primary flex flex-col gap-y-3 items-center justify-center p-4 w-[80px] rounded-full">
              <span className="font-poppins text-lg text-text">
                {tomorrowDay}
              </span>
              <span className="font-semibold text-lg text-text">
                {tomorrowDate}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-secondary w-[300px] rounded-xl flex flex-col mb-2">
          <div className="flex items-center justify-between p-3 ">
            <h1 className="font-poppins text-xl text-text">Your Information</h1>
            <BadgeInfo className="h-6 w-6 text-accent" />
          </div>
          <div className="rounded-full bg-secondary border-4 border-accent  h-24 w-24 self-center mb-4">
            <div className="flex items-center justify-center h-full">
              <img
                src={user.user.imageUrl}
                alt="user_image"
                className="rounded-full"
              />
            </div>
          </div>
          <div className="p-3 font-poppins">
            <div className="flex gap-x-1 items-center">
              <h1 className="text-md text-text">Id: </h1>
              <span className="text-accent font-semibold text-sm">
                {userId}
              </span>
            </div>
            <hr className="mt-2 mb-2 " />
            <div className="flex  items-center gap-x-1">
              <h1 className="text-md text-text">Email: </h1>
              <span className="text-accent font-semibold text-sm">
                {user.user.primaryEmailAddress.emailAddress}
              </span>
            </div>
            <hr className="mt-2 mb-2 " />
            <div className="flex  items-center gap-x-1">
              <h1 className="text-md text-text">Name: </h1>
              <span className="text-accent font-semibold text-sm">
                {user.user.fullName}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-primary w-[300px] grid-cols-5 gap-x-16 relative mb-2 hidden lg:grid">
          <div className=" w-2 bg-accent" />
          <div className=" w-2 bg-background" />
          <div className=" w-2 bg-background" />
          <div className=" w-2 bg-background" />
          <div className=" w-2 bg-accent" />
          <div className="absolute top-3 flex justify-between items-center">
            <h1 className="font-poppins text-xl text-text ml-2">
              Your Subjects
            </h1>
            <ActivitySquare className="h-6 w-6 text-accent ml-28" />
          </div>
          {loading && (
            <Shell className="absolute animate-spin text-text top-[50%] left-[45%] h-8 w-8" />
          )}

          {!loading && uniqueSubjectsArray.length === 0 && (
            <div className=" absolute top-10 ml-2 bg-background w-[95%] rounded-r-md flex items-center justify-center mt-3">
              <p className="text-text text-sm">
                Seems like you dont have any subjects right now! <br /> Add
                subjects to your students and they'll show here
              </p>
            </div>
          )}

          {!loading && (
            <>
              <div className=" absolute top-10  ml-2 grid grid-cols-3 gap-3">
                {uniqueSubjectsArray.map((subject) => (
                  <NavLink key={subject} to={`/attendance/${subject}`}>
                    <div className="bg-white border-4 rounded-lg border-accent grid grid-cols-3 ml-2 mr-5">
                      <h1 className="text-lg ml-2 font-semibold text-accent">
                        {subject}
                      </h1>
                    </div>
                  </NavLink>
                ))}
              </div>
              <div className="absolute top-32 flex justify-between items-center mt-2 ">
                <h1 className="font-poppins text-xl text-text ml-2">
                  Your Assignments
                </h1>
                <DatabaseZap className="h-6 w-6 text-accent ml-16" />
              </div>
              <div className="mt-2 absolute top-40  ml-2 flex flex-col gap-y-2 w-[95%]">
                {!loading && userAssignments.length === 0 && (
                  <div className=" absolute ml-2 bg-background w-[95%] rounded-r-md flex items-center justify-center p-1">
                    <p className="text-text text-sm">
                      Seems like you haven't uploaded any assignments
                      <br />
                      Upload them and youll see the recent ones here
                    </p>
                  </div>
                )}

                {userAssignments.map((notes, i) => (
                  <NavLink key={notes.id} to={`/assignments/${notes._id}`}>
                    <div
                      className={`
                ${
                  notes.category === "Hard"
                    ? "border-red-400"
                    : notes.category === "Medium"
                    ? "border-yellow-400"
                    : "border-green-400"
                }
                bg-background rounded-r-md border-l-4 p-1 flex flex-col gap-y-1`}
                    >
                      <h1 className="self-center text-text font-bold flex items-center gap-x-1">
                        <span>
                          <StickyNote className="h-4 w-4 text-accent font-bold" />
                        </span>
                        <span>{notes.topic}</span>
                      </h1>
                      <h1 className="flex items-center justify-between">
                        <span className="font-semibold text-accent">
                          {new Date(notes.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-accent">
                          {notes.subject_name}
                        </span>
                      </h1>
                    </div>
                  </NavLink>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="bg-accent w-[300px] rounded-xl flex flex-col p-3 mb-2">
          <div className="flex justify-between">
            <h1 className="font-poppins text-xl text-text mb-7">
              Your Recent Notes
            </h1>
            <ScrollText className="h-6 w-6 text-text" />
          </div>

          {loading && (
            <Shell className=" self-center mt-14 animate-spin h-8 w-8 text-text" />
          )}

          {!loading && userNotes.length === 0 && (
            <div className="flex items-center justify-center">
              <p className="text-text text-sm">
                Seems like you haven't published any notes <br />
                Publish them and you'll see the recent one's here
              </p>
            </div>
          )}

          {!loading && (
            <div className="flex flex-col space-y-2 mt-2">
              {userNotes.map((notes, i) => (
                <NavLink key={notes.id} to={`/notes/${notes._id}`}>
                  <div
                    className={`
                ${
                  notes.category === "Hard"
                    ? "border-red-400"
                    : notes.category === "Medium"
                    ? "border-yellow-400"
                    : "border-green-400"
                }
                bg-background rounded-r-md border-l-4 p-2 flex flex-col gap-y-1`}
                  >
                    <h1 className="self-center text-text font-bold flex items-center gap-x-1">
                      <span>
                        <StickyNote className="h-4 w-4 text-accent font-bold" />
                      </span>
                      <span>{notes.heading}</span>
                    </h1>
                    <h1 className="flex items-center justify-between">
                      <span className="font-semibold text-accent">
                        {new Date(notes.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-accent">
                        {notes.subject_name}
                      </span>
                    </h1>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
