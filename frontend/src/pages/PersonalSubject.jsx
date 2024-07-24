import axios from "axios";
import {
  BookOpen,
  BookOpenCheck,
  BookText,
  CalendarClock,
  MousePointerClick,
  Percent,
  PercentCircle,
  ScanBarcode,
  Shell,
  Tally4,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const PersonalSubject = ({ isOpen }) => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [subject, setSubject] = useState({});
  const [student, setStudent] = useState({});

  const [testName, setTestName] = useState("");
  const [testGrade, setTestGrade] = useState("");

  const [allGrades, setAllGrades] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/subjects/${id}`)
      .then((res) => {
        setSubject(res.data);
        // setGrade(res.data.grade);
        setSubjectName(res.data.subject_name);
        axios
          .get(`http://localhost:5555/students/${res.data.student_id}`)
          .then((res) => {
            setStudent(res.data);
            // setLoading(false);
            axios.get(`http://localhost:5555/testgrade`).then((res) => {
              // console.log(res.data);
              setLoading(false);
              setAllGrades(res.data);
            });
          });
      })
      .catch((err) => {
        console.log("Error");
      });
  }, [id]);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:5555/testgrade`)
  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const [subjectName, setSubjectName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const subjectId = subject._id;

    axios
      .put(`http://localhost:5555/subjects/${subjectId}`, {
        grade: percentage,
        subject_name: subjectName,
      })
      .then(() => {
        enqueueSnackbar("Subject Updated Successfully", { variant: "success" });
        axios
          .get(`http://localhost:5555/subjects/${id}`)
          .then((res) => {
            setSubject(res.data);
            // setGrade(res.data.grade);
            setSubjectName(res.data.subject_name);
            axios
              .get(`http://localhost:5555/students/${res.data.student_id}`)
              .then((res) => {
                setStudent(res.data);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.log("Error");
          });
      });
  };

  const testUpdate = (e) => {
    setLoading(true);
    e.preventDefault();

    for (let i = 0; i < studentsTestGrade.length; i++) {
      if (
        testName.toUpperCase() === studentsTestGrade[i].test_name.toUpperCase()
      ) {
        enqueueSnackbar(
          "Test already exists. You can edit the test if you want.",
          { variant: "warning" }
        );
        setLoading(false);
        return;
      }
    }

    const inputRegex = /^\d+\/\d+$/;

    const numerator = testGrade.split("/")[0];
    const denominator = testGrade.split("/")[1];

    if (!inputRegex.test(testGrade) || +denominator < +numerator) {
      enqueueSnackbar(
        "Format should be x/y , where x should be smaller than y",
        { variant: "error" }
      );
      setLoading(false);
      return;
      // return;
    }

    axios
      .post(`http://localhost:5555/subjects/testgrade`, {
        subject_name: subject.subject_name,
        subject_id: subject._id,
        student_name: student.name,
        student_id: student._id,
        teacher_id: subject.teacher_id,
        grade: testGrade,
        test_name: testName.toUpperCase(),
      })
      .then(() => {
        enqueueSnackbar("Test Grade Updated Successfully", {
          variant: "success",
        });
        axios.get(`http://localhost:5555/testgrade`).then((res) => {
          // console.log(res.data);
          setLoading(false);
          setAllGrades(res.data);
          setTestName("");
          setTestGrade("");
        });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Error Updating Test Grade", { variant: "error" });
      });
  };

  const studentsTestGrade = allGrades.filter(
    (grade) =>
      grade.student_id === student._id && subject._id === grade.subject_id
  );

  // console.log(studentsTestGrade);
  // console.log(studentsTestGrade);

  let totalMarks = 0;
  let acheivedMarks = 0;

  studentsTestGrade.forEach((grade) => {
    const [achieved, total] = grade.grade.split("/");
    totalMarks += parseInt(total);
    acheivedMarks += parseInt(achieved);
  });

  const percentage = (acheivedMarks / totalMarks) * 100;

  console.log(studentsTestGrade);

  return (
    <main className={`mt-24 min-h-screen font-poppins ${!isOpen && "mx-auto"}`}>
      {loading && (
        <Shell className="h-12 w-12 animate-spin text-text absolute top-[350px] right-[550px]" />
      )}

      {!loading && (
        <section className="">
          <div className="flex items-center gap-x-3">
            <h1 className="text-text text-4xl font-semibold">
              {subject.subject_name}
            </h1>
            <BookOpen className="text-accent h-8 w-8" />
          </div>

          <div className="mt-10 flex items-center gap-x-3">
            <h1 className="text-text text-2xl ">Details About the Subject</h1>
            <ScanBarcode className="h-6 w-6 text-accent" />
          </div>

          <div className="grid grid-cols-3 gap-x-4   mt-10">
            <div className="flex flex-col items-center justify-center bg-secondary p-3 rounded-lg">
              <h2 className="text-text font-semibold">Subject Id </h2>
              <span className="text-text">{subject._id}</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-secondary p-3 rounded-lg">
              <h2 className="text-text font-semibold">Teacher's Id </h2>
              <span className="text-text text-sm">{subject.teacher_id}</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-secondary p-3 rounded-lg">
              <h2 className="text-text font-semibold">Allotment Date </h2>
              <span className="text-text">
                {new Date(subject.createdAt).toDateString()}
              </span>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="text-text text-2xl flex items-center gap-x-2">
              <span className="text-accent text-sm underline">
                {student.rollnumber}
              </span>
              {student.name}'s Overall Report
            </h1>
          </div>

          <div className="mt-10 grid grid-cols-5 place-content-between gap-x-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-text flex gap-x-1 items-center">
                <BookText className="h-4 w-4 text-accent" />
                <span className="text-text">Subject</span>
              </div>
              <h1 className="text-accent text-lg font-bold">
                {subject.subject_name}
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-text flex gap-x-1 items-center">
                <Percent className="h-4 w-4 text-accent" />
                <span className="text-text">Percentage</span>
              </div>
              <h1 className="text-accent text-lg font-bold">
                {((acheivedMarks / totalMarks) * 100).toFixed(2)}%
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-text flex gap-x-1 items-center">
                <Tally4 className="h-4 w-4 text-accent" />
                <span className="text-text">Total Marks</span>
              </div>
              <h1 className="text-accent text-lg font-bold">
                {acheivedMarks} / {totalMarks}
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-text flex gap-x-1 items-center">
                {percentage > 33 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className="text-text">Status</span>
              </div>
              <h1
                className={`${
                  percentage > 33 ? "text-emerald-400" : "text-red-400"
                } text-lg font-bold`}
              >
                {percentage > 33 ? "PASS" : "FAIL"}
              </h1>
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={handleSubmit}
                className="font-bold text-text hover:border-b-4 border-accent transition-all"
              >
                Update in Database
              </button>
            </div>
          </div>

          <section className="mt-10">
            <h1 className="text-text text-2xl flex items-center gap-x-2">
              <span className="text-accent text-sm underline">
                {student.rollnumber}
              </span>
              Update {student.name}'s Test Scores
            </h1>

            <div className="mt-10">
              <form
                className="flex gap-x-2 items-center justify-between"
                onSubmit={testUpdate}
              >
                <input
                  type="text"
                  placeholder="Test Name..."
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 w-60 bg-background text-text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Marks Scored..."
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 w-60 bg-background text-text"
                  value={testGrade}
                  onChange={(e) => setTestGrade(e.target.value)}
                  required
                />
                <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2">
                  Set Test Grade
                </button>
              </form>
            </div>
          </section>

          <section className="mt-10 mb-3 ">
            <div className="grid grid-cols-3 gap-x-3 gap-y-3">
              {studentsTestGrade.map((grade) => (
                <Link key={grade._id} to={`/test/${grade._id}`}>
                  <div className="flex flex-col border-l-2 border-primary p-3 hover:bg-accent group relative transition-all">
                    <h1 className="text-background absolute z-[-10] group-hover:z-[10] flex items-center top-[40%] left-[10%] gap-x-4 ">
                      Wanna Edit the Scores
                      <MousePointerClick className="h-8 w-8" />
                    </h1>
                    <div className="flex items-center mb-4">
                      <h2 className="font-bold text-3xl text-accent">
                        <BookOpenCheck />
                        {grade.test_name.toUpperCase()}
                      </h2>
                    </div>
                    <span className="text-text flex gap-x-2">
                      <CalendarClock className="text-accent" />
                      <span className="group-hover:hidden">
                        {new Date(grade.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                    <div className="flex  mt-4 items">
                      <h2 className="text-accent flex gap-x-2 font-extrabold text-2xl items-center">
                        <PercentCircle />
                        Marks: {grade.grade}
                      </h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </section>
      )}
    </main>
  );
};

export default PersonalSubject;
