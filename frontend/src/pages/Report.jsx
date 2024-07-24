import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  Activity,
  AreaChart,
  BookCheck,
  CalendarDays,
  Download,
  FilePieChart,
  Library,
  PercentCircle,
  Shell,
  TrendingDown,
  TrendingUp,
  UserCog,
} from "lucide-react";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Report = ({ isOpen }) => {
  const { userId } = useAuth();
  const [inputRollNumber, setInputRollNumber] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading2, setLoading2] = useState(false);

  const pdfRef = useRef();

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`${student[0].name}'s-report.pdf`);
    });
  };

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5555/students").then((res) => {
      setAllStudents(
        res.data.filter((student) => student.teacher_id === userId)
      );
      setLoading(false);
    });
  }, [userId]);

  const submit = () => {
    // console.log(inputRollNumber);

    const enteredRollNumber = inputRollNumber;

    const regex = /^\d{10}$/;

    if (!regex.test(+enteredRollNumber)) {
      enqueueSnackbar("Rollnumber should be a number and 10 digits long.", {
        variant: "warning",
      });
      return;
    }

    setCount((prev) => prev + 1);
    setCount(1);

    setLoading(true);
    axios
      .get("http://localhost:5555/students")
      .then((res) => {
        setStudent(
          res.data
            .filter((student) => student.teacher_id === userId)
            .filter((student) => student.rollnumber === enteredRollNumber)
        );

        setSubjects([]);
        setGrades([]);
        setCount2(0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   console.log(student);

  const getsubjects = (id) => {
    setLoading2(true);
    setCount2(1);
    axios
      .get("http://localhost:5555/subjects")
      .then((res) => {
        setSubjects(res.data.filter((subject) => subject.student_id === id));

        axios.get(`http://localhost:5555/testgrade`).then((res) => {
          setGrades(res.data.filter((grade) => grade.student_id === id));
        });

        setLoading2(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const groupedObjects = grades.reduce((acc, obj) => {
    const { subject_id } = obj;

    // Create an array for the subject_id if it doesn't exist
    acc[subject_id] = acc[subject_id] || [];

    // Push the current object to the array
    acc[subject_id].push(obj);

    return acc;
  }, {});

  //   console.log(groupedObjects);

  //   console.log(subjects, grades);

  const onClick = (e) => {
    setInputRollNumber(e.target.innerHTML);
  };

  return (
    <main className={`mt-24 font-poppins min-h-screen ${!isOpen && "mx-auto"}`}>
      <section className="">
        <h1 className="text-2xl font-bold text-text mb-2 flex items-center gap-x-2">
          <FilePieChart className="text-accent w-8 h-8" />
          Generate Report's
          <span className="text-background">
            {" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit{" "}
          </span>
        </h1>

        <p className="text-accent">
          Here you can generate report for any of your students
        </p>
      </section>
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-text mb-6 ">
          Your current Students
        </h1>
        <div className="grid grid-cols-4 gap-y-2">
          {allStudents.map((student) => (
            <h1
              key={student._id}
              className="text-text p-1 border-l-4 border-accent cursor-pointer hover:scale-105 transition-all"
              onClick={(e) => onClick(e)}
            >
              {student.rollnumber}
            </h1>
          ))}
        </div>
      </section>
      <section className="mt-10 flex items-center justify-center gap-x-4">
        <input
          type="text"
          placeholder="Enter rollnumber or click on one"
          className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 w-60 bg-background text-text placeholder:text-sm"
          value={inputRollNumber}
          onChange={(e) => setInputRollNumber(e.target.value)}
        />
        <button
          className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2"
          onClick={submit}
        >
          Generate
        </button>
      </section>
      {loading && (
        <div className="flex items-center justify-center mt-10">
          <Shell className="h-24 w-24 animate-spin text-text" />
        </div>
      )}

      {!loading && student.length === 0 && count !== 0 && (
        <h1 className="text-center mt-10 font-bold text-2xl">
          No Such Student Found
        </h1>
      )}
      <div ref={pdfRef}>
        {!loading && student.length !== 0 && (
          <>
            <div className="flex flex-col">
              <section className="mt-10 flex border-l-4 border-accent">
                <div className="flex gap-x-16 items-center ml-2">
                  <UserCog className="text-accent w-24 h-24" />
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-lg text-text">Name</h1>
                    <h1 className="text-accent font-bold">
                      {student[0]?.name}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-lg text-text">Email</h1>
                    <h1 className="text-accent font-bold">
                      {student[0]?.email}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-lg text-text">Rollnumber</h1>
                    <h1 className="text-accent font-bold">
                      {student[0]?.rollnumber}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-lg text-text">Enrolled on</h1>
                    <h1 className="text-accent font-bold">
                      {new Date(student[0]?.createdAt).toLocaleDateString()}
                    </h1>
                  </div>
                </div>
              </section>
              {count2 === 0 && (
                <button
                  onClick={() => getsubjects(student[0]?._id)}
                  className="text-text font-semibold hover:border-b-4 border-accent w-[40%] mx-auto transition-all"
                >
                  Wanna get this students stats ?{" "}
                </button>
              )}
            </div>

            {loading2 && (
              <div className="flex items-center justify-center mt-10">
                <Shell className="h-10 w-10 animate-spin text-text" />
              </div>
            )}

            {!loading2 && subjects.length === 0 && count2 === 1 && (
              <h1 className="text-center  text-text mt-10 font-bold text-2xl">
                Student is not Enrolled in any Subjects
              </h1>
            )}

            {!loading2 && subjects.length !== 0 && (
              <>
                <div className="mt-10 border-l-4 border-accent">
                  <h1 className="text-2xl font-bold ml-3 text-text">
                    {student[0].name}'s Subject's
                  </h1>
                </div>
                <div className="grid grid-cols-3 gap-4  place-items-center mt-8">
                  {subjects.map((subject) => (
                    <NavLink
                      key={subject._id}
                      to={`http://localhost:3000/subjects/${subject._id}`}
                      className="hover:scale-110 transition-all"
                    >
                      <div>
                        <div className="flex flex-col items-start text-text border-primary border-2 p-4 rounded-lg w-[100%] relative">
                          <div className="h-10 w-10 bg-primary rounded-full absolute flex items-center justify-center top-[-18px] left-[-10px]">
                            <AreaChart className="h-6 w-6 text-accent" />
                          </div>
                          <div className="mt-3 flex flex-col gap-y-4">
                            <div className="flex gap-x-1 items-center">
                              <Library className="h-5 w-5 text-accent" />
                              <h2 className="text-md font-semibold">
                                Subject Name:
                              </h2>
                              <h1 className="text-lg font-bold text-accent">
                                {subject.subject_name}
                              </h1>
                            </div>
                            <div className="flex gap-x-1 items-center">
                              <PercentCircle className="h-5 w-5 text-accent" />
                              <h2 className="text-md font-semibold">
                                Overall Grade:
                              </h2>
                              <h1
                                className={` ${
                                  subject.grade < 33
                                    ? "text-red-400"
                                    : "text-emerald-400"
                                } text-lg font-bold text-accent`}
                              >
                                {subject.grade}%
                              </h1>
                            </div>
                            <div className="flex gap-x-1 items-center">
                              <CalendarDays className="h-5 w-5 text-accent" />
                              <h2 className="text-md font-semibold">
                                Alloted On:
                              </h2>
                              <h1 className="text-lg font-bold text-accent">
                                {new Date(
                                  subject.createdAt
                                ).toLocaleDateString()}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  ))}
                </div>
              </>
            )}

            {!loading2 && grades.length !== 0 && (
              <section className="mt-10 mb-3">
                <h1 className="text-text text-2xl font-bold flex gap-x-2 items-center">
                  <Activity className="h-10 w-10 text-accent" />
                  Subject Wise Test Report
                </h1>
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
                            to={`http://localhost:3000/test/${obj._id}`}
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
              </section>
            )}
          </>
        )}
      </div>

      {!loading2 && count2 === 1 && subjects.length !== 0 && (
        <div className="flex items-center justify-center dark:hidden">
          <button
            className="bg-accent text-text opacity-90 hover:opacity-100  py-2 px-4 rounded mt-2 mr-2 gap-x-2 flex items-center mb-2"
            onClick={downloadPDF}
          >
            <Download />
            Download
          </button>
        </div>
      )}
    </main>
  );
};

export default Report;
