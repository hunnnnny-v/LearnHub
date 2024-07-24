import { DatabaseBackup, DatabaseZap, Shell } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";

const StudentAssignments = () => {
  const [loading, setLoading] = useState(false);
  const [userAssignments, setUserAssignments] = useState([]);
  const [student, setStudent] = useState({});
  const params = useParams(); //router hook which allows accessing the parameter of curr route

  const studentId = params.id; //extracts the id parameter from url

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/students/${studentId}`).then((res) => {
      //fetches info about mentioned student with id
      setStudent(res.data); //once done it sets the student state with student info
      axios.get("http://localhost:5555/assignments").then((res) => {
        setUserAssignments(
          res.data.filter(
            (assignment) => assignment.teacher_id === student.teacher_id
          ) //fetches only if teacher id is matched with teached id of student and set in useasignments
        );
        setLoading(false);
      });
    });
  }, [student.teacher_id, studentId]);

  return (
    <main className="mt-24 min-h-screen font-poppins w-full mr-2">
      {loading && (
        <Shell className="h-16 w-16 text-text animate-spin absolute left-[400px] top-[40%]" />
      )}

      <section>
        <h1 className="text-2xl font-bold text-text flex gap-x-2 items-center">
          <DatabaseZap className="text-accent" />
          Complete Your Assigments
        </h1>
      </section>
      {!loading && (
        <>
          <section className="mt-10">
            <div>
              <h1 className="text-text text-2xl font-bold">Your Assignments</h1>
              <p className="text-accent">All your assignments at one place !</p>
            </div>
            <div className="mt-6 flex flex-col gap-y-4">
              {userAssignments.length === 0 && (
                <div>
                  <h1 className="font-bold text-red-400">
                    You don't have any assignments published
                  </h1>
                </div>
              )}
              {userAssignments.map((notes) => (
                <div key={notes._id}>
                  <NavLink
                    key={notes._id}
                    to={`/student-dashboard/assignment/${studentId}/${notes._id}`}
                  >
                    <div
                      className={`${
                        notes.category === "Easy"
                          ? "border-emerald-400"
                          : notes.category === "Hard"
                          ? "border-red-400"
                          : "border-yellow-400"
                      } border-l-4 p-4 flex items-center cursor-pointer`}
                    >
                      <div className="flex items-center">
                        <div className="rounded-full h-16 w-16 bg-accent flex items-center justify-center">
                          <DatabaseBackup className="text-text" />
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
                          {notes.topic}
                          <span className="text-sm text-text underline">
                            {notes.subject_name}
                          </span>
                        </h1>
                      </div>
                      <div className="flex gap-x-4 ml-auto">
                        <div className="flex flex-col gap-y-1 items-center justify-center">
                          <h1 className=" text-lg text-text">
                            Total Questions
                          </h1>
                          <span className="text-accent font-bold">
                            {notes.questions.length}
                          </span>
                        </div>
                        <div></div>
                      </div>
                      <div className="ml-auto flex flex-col gap-y-2 items-center">
                        <h1 className="font-semibold text-text">Author: </h1>
                        <h3 className="font-bold text-accent">
                          <span>{notes.teacher_name}</span>
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default StudentAssignments;
