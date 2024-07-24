import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpRight, Megaphone, Shell } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";

const Attendance = ({ isOpen }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const uniqueSubjectNames = new Set();
  //collects unique subject names for the current teacher userid.


  //filtered acc to those taught by current teacher and unique subject names are added to the set.
  
  subjects
    .filter((subject) => subject.teacher_id === userId)
    .forEach((subject) => {
      uniqueSubjectNames.add(subject.subject_name);
    });

  const uniqueSubjectsArray = Array.from(uniqueSubjectNames);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/subjects")
      .then((res) => {
        setSubjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className={`mt-24 font-poppins relative ${!isOpen && "mx-auto"}`}>
      {loading && (
        <Shell className="h-16 w-16 text-text animate-spin absolute left-[400px] top-[40%]" />
      )}

      {!loading && (
        <>
          <section className="flex gap-x-3 items-center">
            <Megaphone className="h-8 w-8 text-accent font-bold" />
            <h1 className="text-3xl font-bold text-text">
              Subjectwise Enrolled Student's
            </h1>
            <span className="text-background">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </span>
          </section>

          <section className="mt-10">
            <h1 className="text-xl font-bold">Your Subjects</h1>
          </section>

          <section className="mt-10 grid grid-cols-3 gap-y-4  place-items-center">
            {uniqueSubjectsArray.map((subject) => (
              <NavLink key={subject} to={`/attendance/${subject}`}>
                <div className="bg-primary p-4 rounded-r-md min-w-[200px] flex">
                  <h1 className="text-text text-xl font-bold">{subject}</h1>
                  <ArrowUpRight className="h-5 w-5 text-accent" />
                </div>
              </NavLink>
            ))}
          </section>
        </>
      )}
    </main>
  );
};

export default Attendance;
