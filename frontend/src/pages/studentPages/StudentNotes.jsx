import { ScrollText, Shell } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";

const StudentNotes = () => {

  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const [student, setStudent] = useState({});

  const studentId = params.id;

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://localhost:5555/notes")
      .then((res) => {
        setAllNotes(res.data);
        axios.get(`http://localhost:5555/students/${studentId}`).then((res) => {
          setStudent(res.data);
          setLoading(false);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [studentId]);

  const userNotes = allNotes.filter(
    (notes) => notes.teacher_id === student.teacher_id
  );

  //   console.log(otherTeacherNotes);

  return (
    <main className="mt-24 min-h-screen font-poppins relative w-full">
      {loading && (
        <Shell className="h-16 w-16 text-text animate-spin absolute left-[400px] top-[40%]" />
      )}
      {!loading && (
        <>
          <section className="flex flex-col gap-y-4">
            <h1 className="text-3xl font-bold text-text">
              Notes{" "}
              <span className="text-background">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </span>
            </h1>
            <div className="flex gap-x-3 items-center">
              <h3 className="text-text text-xl ">
                Read the notes published by your head teacher
              </h3>
              <ScrollText className="text-accent h-5 w-5" />
            </div>
          </section>

          <section className="mt-10">
            <div>
              <h1 className="text-text text-2xl font-bold">Teacher's Notes</h1>
              <p className="text-accent">Knowledge is the key to success</p>
            </div>

            <div className="mt-6 flex flex-col gap-y-4 mb-2">
              {userNotes.map((notes) => (
                <NavLink
                  key={notes._id}
                  to={`/student-dashboard/${studentId}/${notes._id}`}
                >
                  <div
                    className={` ${
                      notes.category === "Easy"
                        ? "border-emerald-400"
                        : notes.category === "Hard"
                        ? "border-red-400"
                        : "border-yellow-400"
                    } border-accent border-l-4 p-4 flex items-center cursor-pointer`}
                  >
                    <div className="flex items-center">
                      <div className="rounded-full h-16 w-16 bg-accent flex items-center justify-center">
                        <ScrollText className="text-text" />
                      </div>
                      <img
                        src="/curls.svg"
                        alt="hey"
                        className="h-16 w-16  dark:hidden"
                      />
                      <img
                        src="/curls-dark.svg"
                        alt="arrow"
                        className="h-16 w-16 hidden dark:block"
                      />
                      <h1 className="ml-4 text-3xl text-accent flex items-center gap-x-2">
                        {notes.heading}
                        <span className="text-sm text-text underline">
                          {notes.subject_name}
                        </span>
                      </h1>
                    </div>
                    <div className="ml-auto flex flex-col gap-y-2 items-center">
                      <h1 className="font-semibold text-text">Author: </h1>
                      <h3 className="font-bold text-accent">
                        {notes.teacher_name}
                      </h3>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default StudentNotes;
