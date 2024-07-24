import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Shell } from "lucide-react";
// import { CalendarDays, Shell } from "lucide-react";
// import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

const SubjectAttendance = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentSubject, setCurrentSubject] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const { userId } = useAuth();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/subjects`)
      .then((res) => {
        setCurrentSubject(
          res.data
            .filter((subject) => subject.teacher_id === userId) //filter sub on userid
            .filter((subject) => subject.subject_name === id) //further on id
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, userId]); //dependency array has id and userId which means that effect will re run whenever the values of id and userId changes.

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
  ); //contains the students who have a correspidning entry in the current subject
  //created by filtering students who are enrolled in the current subject.it uses the currensubject and allstudents class.
  // console.log(commonObjects);

  // const [isMarked, setIsMarked] = useState([]);

  // const onPresent = async (id, name, rollnumber, email) => {
  //   setLoading(true);

  //   await axios.get("http://localhost:5555/attendance").then((res) => {
  //     setIsMarked(
  //       res.data.filter(
  //         (student) =>
  //           student.student_id === id &&
  //           student.date === new Date().toLocaleDateString()
  //       )
  //     );
  //     // .filter((student) => student._id === id);

  //     console.log(isMarked);
  //   });

  //   // console.log(isMarked);

  //   if (isMarked.length > 0) {
  //     setLoading(false);
  //     return;
  //   }

  //   await axios
  //     .post("http://localhost:5555/attendance", {
  //       student_id: id,
  //       student_name: name,
  //       rollnumber: rollnumber,
  //       date: new Date().toLocaleDateString(),
  //       marking: "P",
  //       student_email: email,
  //     })
  //     .then(() => {
  //       enqueueSnackbar("Attendance Marked Successfully", {
  //         variant: "success",
  //       });
  //       commonObjects.pop();
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // useEffect(() => {
  //   const check = (id = "123", date = "11/10/2023") => {
  //     axios.get("http://localhost:5555/attendance").then((res) => {
  //       setIsMarked(
  //         res.data.filter(
  //           (student) => student.student_id === id && student.date === date
  //         )
  //       );
  //       // .filter((student) => student._id === id);

  //       // console.log(isMarked);
  //     });
  //   };
  //   check();
  // }, []);

  // console.log(isMarked);

  return (
    <main className="font-poppins relative min-h-[35vh]">
      {loading && (
        <Shell className="text-text animate-spin left-[400px] top-[40%]" />
      )}

      {!loading && (
        <>
          <section className="flex items-center justify-center flex-col gap-y-3">
            <h1 className="text-2xl font-bold text-text">
              {" "}
              Enrolled Student's of <span className="text-accent">{id}</span>
            </h1>
            <span className="text-md text-text">
              Only the students which are enrolled in this subject by you will
              be shown here!
            </span>
          </section>

          <section className="mt-10">
            <div>
              {commonObjects.map((student) => (
                <div
                  key={student._id}
                  className="grid grid-cols-4 place-items-center gap-y-12 border-l-4 border-accent m-4"
                >
                  <div className="flex gap-x-1 items-center p-4">
                    <div className="h-4 w-4 rounded-full bg-accent" />
                    <h1 className="text-lg font-bold text-text">
                      {student.rollnumber}
                    </h1>
                  </div>
                  <div className="flex gap-x-1 items-center ">
                    <h1 className="text-lg font-bold text-accent">
                      {student.email}
                    </h1>
                  </div>
                  <div className="flex gap-x-1 items-center ">
                    <h1 className="text-lg font-bold text-text">
                      {student.name}
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <NavLink to={`/students/${student._id}`}>
                      <button className="text-sm font-semibold text-text border-dashed border-accent border rounded-md p-2 hover:bg-accent transition-all">
                        View {student.name}'s Profile
                      </button>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default SubjectAttendance;
