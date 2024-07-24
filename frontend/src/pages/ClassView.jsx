import { useAuth } from "@clerk/clerk-react";
import axios from "axios";//library used for making http req
import { ArrowUpRight, Clapperboard, Forward, Shell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ClassView = ({ isOpen }) => {
  const [loading, setLoading] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const { userId } = useAuth();
  const uniqueSubjectNames = new Set();//filters and collects unique subject names 

  subjects
    .filter((subject) => subject.teacher_id === userId)
    .forEach((subject) => {
      uniqueSubjectNames.add(subject.subject_name);
    });//iterate over subjects array and adding unique subject names to set

  const uniqueSubjectsArray = Array.from(uniqueSubjectNames);//these names are converetd back to an array 

  useEffect(() => {//fetch subjects 
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
    <main
      className={`mt-24 font-poppins relative ${!isOpen && "w-full mx-auto"}`}
    >
      {loading && (
        <Shell className="h-16 w-16 text-text animate-spin absolute left-[400px] top-[40%]" />
      )}

      <section className="flex flex-col gap-y-3">
        <h1 className="text-3xl text-text font-bold flex gap-x-2 items-center">
          <Clapperboard className="text-accent h-8 w-8" />
          Class View
        </h1>
        <p className="text-text font-semibold ">
          Here you can see how your class will look in an interactive way
        </p>
      </section>

      {!loading && (
        <>
          <section className="mt-10">
            <h1 className="text-2xl font-bold text-text flex items-center gap-x-1">
              Choose Your Class{" "}
              <span>
                <Forward className="text-accent" />
              </span>
            </h1>
          </section>

          <section className="mt-10 grid grid-cols-4 gap-4 place-items-center">
            {uniqueSubjectsArray.map((subject) => (
              <NavLink
                key={subject}
                to={`/class-view/${subject}`}
                className="z-20"
              >
                <div className="bg-primary p-4 rounded-r-md min-w-[200px] flex ">
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

export default ClassView;
