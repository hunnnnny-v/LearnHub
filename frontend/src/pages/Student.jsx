import { Shell, StepForward, Trash2, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useSnackbar } from "notistack";
import { NavLink } from "react-router-dom";

const Student = ({ isOpen }) => {
  //isOpen is a prop
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentRollNumber, setStudentRollNumber] = useState(null);
  const [studentImageUrl, setStudentImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const user = useUser(); //gets the authenticated users's id and user infor
  const teacher_email = user.user.emailAddresses[0].emailAddress; //extracts the teacher's email address from user information
  const { enqueueSnackbar } = useSnackbar();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/students")
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const password = Math.random().toString(36).slice(-8); //generates a random alphanumeric password with length of 8 characters.

  const onSubmit = (e) => {
    e.preventDefault();
    const curr = students.filter((student) => student.teacher_id === userId); //filters the array of students to only include those whose teachersid matches the current user id , the filtered are stored in the curr array.

    for (let i = 0; i < curr.length; i++) {
      if (
        curr[i].rollnumber === studentRollNumber ||
        curr[i].email === studentEmail //checks if the current student has the same rollno and email of the student being submitted through the form.
      ) {
        enqueueSnackbar(
          "Similar student already exists. Can't add the student",
          { variant: "error" } //triggers the display by adding a message that similar student already exists .
        );
        return;
      }
    }

    setLoading(true);
    axios
      .post("http://localhost:5555/students", {
        name: studentName,
        email: studentEmail,
        rollnumber: studentRollNumber,
        teacher_id: userId,
        password: password,
        imageUrl: studentImageUrl.length === 0 ? "" : studentImageUrl,
        teacher_email: teacher_email,
      })
      .then(() => {
        enqueueSnackbar("Student Added Successfully", { variant: "success" });
        axios
          .get("http://localhost:5555/students")
          .then((res) => {
            setStudents(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar("Error Adding Student", { variant: "error" });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteStudent = (studentId) => {
    // console.log(studentId);

    setLoading(true);

    axios
      .delete(`http://localhost:5555/students/${studentId}`)
      .then(() => {
        setLoading(false);
        console.log("Student Deleted Successfully");
        enqueueSnackbar("Student Deleted Successfully", { variant: "success" });
        axios
          .get("http://localhost:5555/students")
          .then((res) => {
            setStudents(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar("Error Deleting Student", { variant: "error" });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(students.filter((student) => student.teacher_id === userId));

  return (
    <main
      className={`mt-24 font-poppins overflow-y-hidden min-h-[85vh] ${
        !isOpen && "flex items-center justify-center flex-col w-full"
      }`}
    >
      <h1 className="text-3xl font-bold text-text">Student's</h1>
      <section className="mt-10">
        <div className="flex items-center gap-x-2 cursor-pointer group">
          <h1 className="font-bold uppercase text-text">
            Add Students to your class
          </h1>
          <StepForward className="h-5 w-5 text-accent group-hover:ml-2 transition-all" />
        </div>
        <div>
          <form //this is a form for adding a new student with fields name,email,rollno,image url
            className=" flex flex-col md:flex-row gap-x-4 mt-10"
            onSubmit={onSubmit}
          >
            <input
              type="text"
              placeholder="Enter Student's Name"
              className="border-2 border-accent placeholder:text-gray-400 rounded-md placeholder:text-sm p-2 mt-2 w-44 bg-background text-text"
              onChange={(e) => setStudentName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Enter Student's Email"
              className="border-2 border-accent placeholder:text-gray-400 rounded-md placeholder:text-sm p-2 mt-2 w-44 bg-background text-text"
              onChange={(e) => setStudentEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter Student's Roll Number"
              className="border-2 border-accent placeholder:text-gray-400 rounded-md placeholder:text-sm p-2 mt-2 w-44 bg-background text-text"
              onChange={(e) => setStudentRollNumber(e.target.value)}
              required
              pattern="\d{10}"
            />
            <input
              type="text"
              placeholder="Image Url Optional"
              className="border-2 border-accent placeholder:text-gray-400 
              placeholder:text-sm rounded-md p-2 mt-2 w-44 bg-background text-text"
              onChange={(e) => setStudentImageUrl(e.target.value)}
            />
            <br />
            <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2">
              Add Student
            </button>
          </form>
        </div>
      </section>
      <section className={`mt-10 ${!isOpen && "ml-24"}`}>
        <h1 className="font-bold uppercase text-text">
          Current Students Enrolled By You :{" "}
        </h1>
        {loading && (
          <div className="flex items-center justify-center">
            <Shell className="h-10 w-10 animate-spin text-text" />
          </div>
        )}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
          {!loading &&
            students
              .filter((student) => student.teacher_id === userId)
              .map((student) => (
                <div
                  key={student._id}
                  className="grid  p-4 rounded-lg place-content-between text-text  cursor-pointer hover:scale-105 transition-all mr-4 bg-secondary mb-6 w-auto"
                >
                  <NavLink to={`/students/${student._id}`}>
                    <div className="flex flex-col gap-y-4 ">
                      <User className="text-primary" />
                      <div className="flex gap-x-6 items-center">
                        <h1 className="font-bold text-md">Name:</h1>
                        <span className="uppercase text-md">
                          {student.name}
                        </span>
                      </div>
                      <div className="flex gap-x-1 items-center">
                        <h1 className="font-bold text-md">Email:</h1>
                        <span className="text-sm">{student.email}</span>
                      </div>
                      <div className="flex gap-x-6 items-center">
                        <h1 className="font-bold text-md">RollNumber:</h1>
                        <span className="text-md">{student.rollnumber}</span>
                      </div>
                      <div className="flex gap-x-6 items-center">
                        <h1 className="font-bold text-md">Password:</h1>
                        <span className="text-md">{student.password}</span>
                      </div>
                    </div>
                  </NavLink>

                  <Trash2
                    className=" mt-4 hover:text-delete "
                    onClick={() => deleteStudent(student._id)}
                  />
                </div>
              ))}
        </div>
      </section>
    </main>
  );
};

export default Student;
