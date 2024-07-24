import axios from "axios";
import {
  Activity,
  BookCheck,
  Bookmark,
  CalendarSearch,
  Key,
  ListOrdered,
  MailSearch,
  Shell,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

const StudentHome = () => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [student, setStudent] = useState([]);
  const [teacherName, setTeacherName] = useState([]);
  const [studentSubjects, setStudentSubjects] = useState([]);

  const params = useParams();
  const id = params.id;

  // console.log(id);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/students/${id}`).then((res) => {
      setStudent(res.data);
      axios.get("http://localhost:5555/notes").then((res) => {
        setTeacherName(
          res.data.filter(
            (teacher) => teacher.teacher_id === student.teacher_id
          )
        );

        setLoading(false);
      });
    });
  }, [id, student.teacher_id]);

  const [studentGrades, setGrades] = useState([]);

  useEffect(() => {
    setLoading2(true);
    axios.get(`http://localhost:5555/subjects`).then((res) => {
      setStudentSubjects(
        res.data.filter((subject) => subject.student_id === id)
      );
      setLoading2(false);
      axios.get(`http://localhost:5555/testgrade`).then((res) => {
        setGrades(res.data.filter((grade) => grade.student_id === id));
      });
    });
  }, [id]);

  const joiningDate = new Date(student.createdAt).toLocaleDateString();

  // console.log(studentGrades);

  const groupedObjects = studentGrades.reduce((acc, obj) => {
    const { subject_id } = obj;

    // Create an array for the subject_id if it doesn't exist
    acc[subject_id] = acc[subject_id] || [];

    // Push the current object to the array
    acc[subject_id].push(obj);

    return acc;
  }, {});

  let imageId = "";

  if (!student.imageUrl) {
    imageId = "none";
  } else {
    let x = "";

    const image = student?.imageUrl?.split("/");
    x = image[0];

    for (let i = 0; i < image.length; i++) {
      if (image[i].length > x.length) x = image[i];
    }

    imageId = x;
  }

  // console.log(groupedObjects);

  return (
    <main className="mt-24 min-h-screen font-poppins w-full mr-3 mb-10">
      {loading && <Shell className="h-10 w-10 animate-spin" />}
      {!loading && (
        <>
          <section className="flex justify-between items-center">
            <h1 className="flex items-center">
              <span className="text-lg font-bold text-text">
                Welcome aboard !
              </span>
              <h1 className="text-3xl font-bold text-accent ml-2">
                {student.name}
              </h1>
            </h1>
            <h1 className="flex gap-x-2 text-text">
              <MailSearch className="text-accent" />
              {student.email}
            </h1>
          </section>
          <section className="mt-10">
            <div className="flex gap-x-2 items-center">
              <Activity className="text-accent" />
              <h1 className="text-2xl font-bold text-text">
                Vital Information
              </h1>
            </div>

            <div className="flex gap-x-4">
              {/* {imageId !== "none" && (
                <div className="col-span-3 gap-y-0  h-20 w-20">
                  <img
                    src={`http://drive.google.com/uc?export=view&id=${imageId}`}
                    alt="student_img"
                    className="rounded-md border-4 border-accent h-20 w-20"
                  />
                </div>
              )} */}
              <div className="mt-4 grid grid-cols-3 gap-y-8 w-full">
                <div className="flex gap-x-2 items-center">
                  <ListOrdered className="h-4 w-4 text-accent" />
                  <h1 className="text-lg font-semibold text-text">
                    Rollnumber:{" "}
                  </h1>
                  <span className="text-xl font-bold text-accent">
                    {student.rollnumber}
                  </span>
                </div>
                <div className="flex gap-x-2 items-center">
                  <UserCircle className="h-4 w-4 text-accent" />
                  <h1 className="text-lg font-semibold text-text">Name: </h1>
                  <span className="text-xl font-bold text-accent">
                    {student.name}
                  </span>
                </div>
                <div className="flex gap-x-2 items-center">
                  <MailSearch className="text-accent h-4 w-4" />
                  <h1 className="text-lg font-semibold text-text">Email: </h1>
                  <span className="text-sm font-bold text-accent">
                    {student.email}
                  </span>
                </div>
                <div className="flex gap-x-2 items-center">
                  <Key className="h-4 w-4 text-accent" />
                  <h1 className="text-lg font-semibold text-text">
                    Your Password:{" "}
                  </h1>
                  <span className="text-xl font-bold text-accent blur-md hover:blur-0 transition-all">
                    {student.password}
                  </span>
                </div>
                <div className="flex gap-x-2 items-center">
                  <UserCheck className="h-4 w-4 text-accent" />
                  <h1 className="text-lg font-semibold text-text">Mentor: </h1>
                  <span className="text-xl font-bold text-accent">
                    {teacherName[0]?.teacher_name}
                  </span>
                </div>
                <div className="flex gap-x-2 items-center">
                  <CalendarSearch className="h-4 w-4 text-accent" />
                  <h1 className="text-lg font-semibold text-text">
                    Joining Date:{" "}
                  </h1>
                  <span className="text-xl font-bold text-accent">
                    {joiningDate}
                  </span>
                </div>
              </div>
            </div>
          </section>{" "}
        </>
      )}

      {loading2 && <Shell className="h-10 w-10 animate-spin" />}

      {!loading2 && (
        <>
          <section className="mt-20">
            <div>
              <div className="flex gap-x-2 items-center">
                <Bookmark className="h-6 w-6 font-bold text-accent" />
                <h1 className="text-2xl font-bold text-text">Your Subjects</h1>
              </div>
              <p className="text-text font-semibold">
                Subjects in which you are enrolled !
              </p>
            </div>

            <div className="grid grid-cols-3 gap-x-4 mt-4">
              {studentSubjects.map((subject) => (
                <div className="flex items-center justify-between border-l-4 p-1 border-r-0 border-l-accent hover:scale-105 cursor-pointer transition-all">
                  <p className="font-bold text-xl text-text">
                    {subject.subject_name}
                  </p>
                  <div className="flex items-center font-bold text-xl">
                    <p
                      className={`${
                        subject.grade > 33 ? "text-emerald-400" : "text-red-400"
                      } `}
                    >
                      {subject.grade}%
                    </p>
                    <span>
                      {subject.grade > 33 ? (
                        <TrendingUp className="h-5 w-5 text-emerald-400 font-bold" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-400 font-bold" />
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex gap-x-1 items-center">
              <ShieldCheck className="h-6 w-6 font-bold text-accent" />
              <h1 className="text-2xl font-bold text-text">Your Tests</h1>
            </div>

            <div>
              {Object.entries(groupedObjects).length === 0 && (
                <div className="flex items-center justify-center">
                  <h1>
                    Currently either you have not given any test's or the mentor
                    has yet to upload the test!
                  </h1>
                </div>
              )}

              {Object.entries(groupedObjects).map(
                ([subjectId, objects], index) => (
                  <section className="mt-5" key={index}>
                    <h1 className="text-xl font-bold text-text flex gap-x-2 items-center mb-2">
                      <BookCheck className="h-6 w-6 text-accent" />
                      {objects[0].subject_name}
                    </h1>
                    <div className="flex flex-col gap-y-2">
                      {objects.map((obj) => (
                        <NavLink
                          key={obj._id}
                          className={`${
                            (parseInt(obj.grade.split("/")[0]) /
                              parseInt(obj.grade.split("/")[1])) *
                              100 >
                            33
                              ? "border-emerald-400"
                              : "border-red-400"
                          } border-l-4 `}
                        >
                          <div className="grid grid-cols-4 place-items-center ">
                            <h1 className="font-semibold text-text flex flex-col items-center gap-y-0.5">
                              <span className="text-xs font-normal text-text">
                                Test Name
                              </span>
                              {obj.test_name.toUpperCase()}
                            </h1>
                            <h1 className="font-semibold text-accent flex flex-col items-center gap-y-0.5">
                              <span className="text-xs font-normal text-text">
                                Marks
                              </span>
                              {obj.grade}
                            </h1>
                            <h1 className="font-semibold text-text flex flex-col items-center gap-y-0.5">
                              <span className="text-xs font-normal text-text">
                                Examination Date
                              </span>
                              {new Date(obj.createdAt).toLocaleDateString()}
                            </h1>

                            <h1
                              className={`
                          ${
                            (parseInt(obj.grade.split("/")[0]) /
                              parseInt(obj.grade.split("/")[1])) *
                              100 >
                            33
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                          text-accent text-lg font-bold flex gap-x-2 items-center`}
                            >
                              {Math.trunc(
                                (parseInt(obj.grade.split("/")[0]) /
                                  parseInt(obj.grade.split("/")[1])) *
                                  100
                              )}
                              %
                              {(parseInt(obj.grade.split("/")[0]) /
                                parseInt(obj.grade.split("/")[1])) *
                                100 >
                              33 ? (
                                <TrendingUp className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-400" />
                              )}
                            </h1>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  </section>
                )
              )}
            </div>
          </section>
          <section className="mt-10 flex items-center justify-center flex-col">
            <h1 className="text-red-400 underline">
              Have any issues regarding the result ?
            </h1>
            <span className="flex items-center justify-center gap-x-4 ">
              <p className="text-text">Send a direct mail to your mentor</p>
              <br />
              <a
                href={`mailto:${student.teacher_email}`}
                className="font-bold text-blue-500 flex gap-x-1 items-center"
              >
                <MailSearch className="h-4 w-4" />
                {student.teacher_email}
              </a>
            </span>
          </section>
        </>
      )}
    </main>
  );
};

export default StudentHome;
