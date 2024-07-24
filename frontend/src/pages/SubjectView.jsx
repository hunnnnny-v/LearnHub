import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { MoveDownRight, Presentation, Shell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

const PERCENTAGES = [];

const SubjectView = ({ isOpen }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentSubject, setCurrentSubject] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allGrades, setAllGrades] = useState([]);

  const { userId } = useAuth();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/subjects`)
      .then((res) => {
        setCurrentSubject(
          res.data
            .filter((subject) => subject.teacher_id === userId)
            .filter((subject) => subject.subject_name === id)
        );
        // setLoading(false);
        axios.get(`http://localhost:5555/testgrade`).then((res) => {
          // console.log(res.data);
          setLoading(false);
          setAllGrades(res.data);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, userId]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/students`)
      .then((res) => {
        setAllStudents(
          res.data.filter((student) => student.teacher_id === userId)
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, userId]);

  const commonObjects = allStudents.filter((obj1) =>
    currentSubject.some((obj2) => obj2.student_id === obj1._id)
  );

  //   console.log(allGrades);

  //  const x = allGrades
  //                     .filter(
  //                       (grade) =>
  //                         grade.student_id === `${student._id}` &&
  //                         id === grade.subject_name
  //                     )
  //                     .map((grade) => (
  //                       <h1>wow</h1>
  //                     ))}

  const getNumber = (student_id, student_rollnumber, student_name) => {
    const studentsTestGrade = allGrades.filter(
      (grade) => grade.student_id === student_id && id === grade.subject_name
    );

    // console.log(studentsTestGrade);

    let totalMarks = 0;
    let acheivedMarks = 0;

    studentsTestGrade.forEach((grade) => {
      const [achieved, total] = grade.grade.split("/");
      totalMarks += parseInt(total);
      acheivedMarks += parseInt(achieved);
    });

    const percentage = ((acheivedMarks / totalMarks) * 100).toFixed(1);

    const obj = {
      name: student_name,
      rollnumber: student_rollnumber,
      grade: parseFloat(percentage),
      subject_name: id,
    };

    PERCENTAGES.push(obj);

    return (
      <div
        className={`${
          percentage >= 85
            ? "bg-emerald-400"
            : percentage < 33
            ? "bg-red-400"
            : "bg-yellow-400"
        } h-7 w-7 rounded-full flex items-center justify-center mt-3`}
      >
        <span className="text-black font-semibold text-[8px]">
          {percentage}%
        </span>
      </div>
    );
  };

  // console.log(PERCENTAGES);

  const uniqueObjectsSet = new Set(
    PERCENTAGES.map((obj) => JSON.stringify(obj))
  );

  const uniqueObjectsArray = Array.from(uniqueObjectsSet, JSON.parse);

  const leaderboard = uniqueObjectsArray.filter(
    (obj) => obj.subject_name === id && obj.grade !== null
  );

  const actualLeaderboard = leaderboard
    .sort((a, b) => b.grade - a.grade)
    .filter((obj) => obj.grade > 65)
    .slice(0, 3);
  // console.log(actualLeaderboard);

  // if (actualLeaderboard.length === 0) return null;

  const [modal, setModal] = useState(true);

  return (
    <main
      className={`font-poppins relative min-h-[35vh] mr-2 ${
        !isOpen && "mx-auto w-full"
      }`}
    >
      {loading && (
        <Shell className="text-text animate-spin left-[400px] top-[40%]" />
      )}

      {!loading && (
        <>
          <section className="w-full min-h-screen mb-10">
            <div className="bg-contain bg-board border-4 border-text w-full h-[60%] flex items-center justify-center relative z-10">
              <h1 className="text-4xl font-bold text-white flex gap-x-2 items-center z-10 absolute">
                <span>
                  <Presentation className="h-10 w-10" />
                </span>
                {id} Classroom
              </h1>

              <img
                src="/teacher.png"
                alt=""
                className="ml-[70%]"
                height={300}
                width={300}
              />

              <section className="absolute left-2 top-4 text-white">
                <h1 className="flex items-center gap-x-2 uppercase font-bold text-xl mb-2">
                  <img src="/podium.png" alt="" height={40} width={40} />
                  LEADERBOARD
                </h1>
                {actualLeaderboard.length === 0 && (
                  <div className="flex flex-col gap-y-2 mb-4">
                    <h1 className="text-xs">
                      Currently none of the students are eligible to be on the
                      leaderboard
                    </h1>
                    <span className="text-xs">
                      Do mind, to come on the leaderboard the{" "}
                      <span className="font-semibold">average percentage </span>
                      of the student needs to be{" "}
                      <span className="font-semibold">atleast above 65%</span>
                    </span>
                  </div>
                )}
                {actualLeaderboard.map((obj, i) => (
                  <div
                    key={obj.name}
                    className="flex gap-x-2  items-center mb-4"
                  >
                    <div
                      className={`${
                        i + 1 === 1
                          ? "bg-[#FFE177]"
                          : i + 1 === 2
                          ? "bg-[#DEECF1]"
                          : "bg-[#FE646F]"
                      } w-5 flex items-center justify-center rounded-t-md`}
                    >
                      <span className="text-black font-bold">{i + 1}</span>
                    </div>
                    <h1
                      className={`${
                        i + 1 === 1
                          ? "text-[#FFE177]"
                          : i + 1 === 2
                          ? "text-[#DEECF1]"
                          : "text-[#FE646F]"
                      } font-semibold text-xs`}
                    >
                      {obj.rollnumber}
                    </h1>
                    <h1
                      className={`${
                        i + 1 === 1
                          ? "text-[#FFE177]"
                          : i + 1 === 2
                          ? "text-[#DEECF1]"
                          : "text-[#FE646F]"
                      } text-xs font-bold`}
                    >
                      {obj.name}
                    </h1>
                    <h1 className="font-bold">
                      {obj.grade}%{" "}
                      <span className="text-[8px] text-white">(average)</span>
                    </h1>
                  </div>
                ))}
                <span className="text-sm underline">
                  Work hard and get on the leaderboard !{" "}
                </span>
              </section>
              <div className="h-28 w-2 bottom bg-text absolute -bottom-24 -z-10 rotate-45 rounded-full" />
              <div className="h-28 w-2 bg-text absolute -bottom-24 -z-10 -rotate-45 rounded-xl" />
            </div>
            <section className=" mt-16">
              <div className="flex flex-col items-center justify-center">
                <h1 className="font-semibold text-2xl text-accent mb-2 z-40 bg-secondary p-2 rounded-md">
                  Your Students will be facing the board!
                </h1>
                <div className="flex items-center justify-center flex-col text-text">
                  <p className="text-xs mb-2">
                    Each color has a significance in this view
                  </p>
                  <p className="text-xs text-center w-full">
                    Students scoring above{" "}
                    <span className="text-emerald-400 font-semibold">85%</span>{" "}
                    in your subject are in{" "}
                    <span className="text-white bg-emerald-400 p-0.5 rounded-md">
                      Green
                    </span>{" "}
                    and the ones below{" "}
                    <span className="text-red-400 font-semibold">33%</span> in{" "}
                    <span className="text-white bg-red-400 p-0.5 rounded-md">
                      Red
                    </span>{" "}
                    and rest in{" "}
                    <span className="text-white bg-yellow-400 p-0.5 rounded-md">
                      Yellow
                    </span>{" "}
                    for you to easily see thier caliber and future potential
                  </p>
                </div>
              </div>

              <section className="mt-4">
                <div className="flex justify-between">
                  <div>
                    <h1 className="text-text font-bold">
                      The Students <MoveDownRight className="text-accent" />
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold text-text">
                      Total Strength in this Lecture :{" "}
                      <span className="text-accent">
                        {commonObjects.length}
                      </span>
                    </h1>
                  </div>
                </div>
              </section>

              <div className="ml-10 grid grid-cols-4">
                {commonObjects.map((student) => (
                  <div
                    className="flex gap-x-2 items-center group transition cursor-pointer group relative"
                    key={student._id}
                    // onClick={() => setModal((prev) => !prev)}
                  >
                    {getNumber(student._id, student.rollnumber, student.name)}
                    {/* <div className="h-4 w-4 rounded-full bg-accent" /> */}
                    <h1 className="flex flex-col gap-x-1 text-xs mt-3">
                      <span className="text-accent">{student.rollnumber}</span>
                      <span className="text-text font-semibold">
                        {student.name}
                      </span>
                    </h1>

                    {modal && (
                      <NavLink
                        to={`http://localhost:3000/students/${student._id}`}
                      >
                        <div className="hidden group-hover:block absolute  w-48 bg-secondary text-accent transition-all -top-10 -left-20 p-1 rounded-xl">
                          <h1 className="text-[8px]">Test Scores:</h1>
                          <div className="grid grid-cols-2 place-items-center">
                            {allGrades
                              .filter(
                                (grade) =>
                                  grade.student_id === student._id &&
                                  grade.subject_name === id
                              )
                              .map((grade) => (
                                <h1 className="text-xs flex gap-x-2 items">
                                  <span>{grade.test_name.toUpperCase()}</span> :{" "}
                                  <span>{grade.grade}</span>
                                </h1>
                              ))}
                          </div>
                        </div>
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </section>
        </>
      )}
    </main>
  );
};

export default SubjectView;
