import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Cross, Edit2, Shell, StepForward, Trash2, User } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

const PersonalStudent = ({ isOpen }) => {
  const { id } = useParams();
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const { userId } = useAuth();

  const currentStudentSubject = allSubjects.filter(
    (subject) => subject.student_id === id
  );

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/students/${id}`)
      .then((response) => {
        setStudent(response.data);
        axios.get("http://localhost:5555/subjects").then((res) => {
          setAllSubjects(res.data);
          axios.get("http://localhost:5555/students").then((res) => {
            setAllStudents(
              res.data.filter(
                (student) => student.teacher_id === userId && student._id !== id
              )
            );
            setLoading(false);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, userId]);

  const addSubject = (e) => {
    e.preventDefault();

    // console.log(subject);

    for (let i = 0; i < currentStudentSubject.length; i++) {
      if (subject.toUpperCase() === currentStudentSubject[i].subject_name) {
        // console.log("Invalid");
        enqueueSnackbar("Subject already exists", { variant: "error" });
        return;
      }
    }

    const teacher_id = student.teacher_id;
    const student_id = student._id;
    const rollnumber = student.rollnumber;

    // onlySubjects.forEach((subjectx) => {
    //   if (subject === subjectx) {
    //     enqueueSnackbar("Subject already exists", { variant: "error" });
    //     return;
    //   }
    // });

    setLoading(true);

    axios
      .post(`http://localhost:5555/subjects`, {
        teacher_id: teacher_id,
        student_id: student_id,
        rollnumber: rollnumber,
        subject_name: subject.toUpperCase(),
        grade: "NIL",
      })
      .then((response) => {
        enqueueSnackbar("Subject added successfully", { variant: "success" });
        axios
          .get("http://localhost:5555/subjects")
          .then((res) => {
            setAllSubjects(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSubject("");
      });
  };

  // console.log(onlySubjects);

  const onDelete = (subjectId) => {
    setLoading(true);

    console.log(subjectId);

    axios
      .delete(`http://localhost:5555/subjects/${subjectId}`)
      .then((res) => {
        // setLoading(false);
        console.log("Subject Deleted Successfully");
        enqueueSnackbar("Subject Deleted Successfully", { variant: "success" });

        axios
          .get("http://localhost:5555/subjects")
          .then((res) => {
            setAllSubjects(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar("Error Deleting Subject", { variant: "error" });
          });
      })
      .catch((err) => {
        console.log("Error");
      });
  };

  // console.log(currentStudentSubject);

  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState("");
  const [rollnumber, setRollnumber] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleEdit = () => {
    console.log(id);
    setOpenEdit((prev) => !prev);
    setName(student.name);
    setRollnumber(student.rollnumber);
    setEmail(student.email);
    if (!student.imageUrl) setImageUrl("");
    else {
      setImageUrl(student.imageUrl);
    }
  };

  const edit = () => {
    if (rollnumber.length !== 10) {
      enqueueSnackbar("Student's rollnumber should be atleast 10 digits long", {
        variant: "info",
      });
      return;
    }

    for (let i = 0; i < allStudents.length; i++) {
      if (rollnumber === allStudents[i].rollnumber) {
        enqueueSnackbar("Student with this rollnumber already exists", {
          variant: "info",
        });
        return;
      }
    }

    for (let i = 0; i < allStudents.length; i++) {
      if (email === allStudents[i].email) {
        enqueueSnackbar("Student with this email already exists", {
          variant: "info",
        });
        return;
      }
    }

    // const linkRegex =
    //   /https:\/\/drive\.google\.com\/file\/d\/([^\/]+)\/view\?usp=sharing/;

    // if (!linkRegex.test(imageUrl)) {
    //   enqueueSnackbar(
    //     "Invalid link. Make sure the link is from Google Drive and the general access is for everyone with the link",
    //     {
    //       variant: "info",
    //     }
    //   );
    //   return;
    // }

    axios
      .put("http://localhost:5555/students/${student._id}", {
        name: name,
        rollnumber: rollnumber,
        email: email,
        imageUrl: imageUrl,
      })
      .then((res) => {
        enqueueSnackbar("Student Detail Updated Successfully", {
          variant: "success",
        });
        axios
          .get("http://localhost:5555/students/${id}")
          .then((response) => {
            setStudent(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      });

    setOpenEdit(false);
  };

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

  // console.log(allStudents);

  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loadingError, setLoadingError] = useState(false);

  const handleImageLoad = () => {
    // Image has loaded successfully
    setLoadingPercentage(100);
  };

  const handleImageError = () => {
    // Image failed to load
    setLoadingError(true);
  };

  const handleImageProgress = (e) => {
    if (e.lengthComputable) {
      const percentage = Math.round((e.loaded / e.total) * 100);
      setLoadingPercentage(percentage);
    }
  };

  return (
    <main
      className={`mr-4 mt-24 min-h-screen font-poppins ${!isOpen && "mx-auto"}`}
    >
      {loading && (
        <Shell className="h-12 w-12 animate-spin text-text absolute top-[350px] right-[550px]" />
      )}
      {!loading && (
        <>
          {" "}
          <h1 className="text-3xl font-bold text-text flex items-center">
            Student's Personal Info{" "}
            <StepForward className="ml-4 h-5 w-5 text-accent group-hover:ml-2 transition-all" />
            <span className="text-background">
              Lorem ipsum dolor sit amet consec
            </span>
          </h1>
          <section className="flex items-center justify-around mt-10 border-2 border-primary rounded-xl p-2 border-dashed mb-10">
            <div className="bg-accent rounded-full p-1 relative">
              {student?.imageUrl?.length === 0 || !student.imageUrl ? (
                <User className="h-24 w-24 text-text" />
              ) : loadingError ? (
                <User className="h-24 w-24 text-text" />
              ) : (
                <>
                  <img
                    src={student?.imageUrl}
                    alt="wow"
                    className="rounded-full h-32 w-32"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    onProgress={handleImageProgress}
                  />
                  {loadingPercentage < 100 && (
                    <Shell className="animate-spin absolute top-10 left-6" />
                  )}
                </>
              )}
            </div>
            <h1 className="text-3xl font-poppins text-text font-bold flex flex-col">
              {student.name}
              <span>{student.rollnumber}</span>
            </h1>
          </section>
          <section>
            {!openEdit && (
              <button
                className=" text-text  hover:border-b-4 hover:border-accent font-bold mt-2 flex items-center gap-x-1 "
                onClick={handleEdit}
              >
                <Edit2 className="h-5 w-5 text-accent" />
                Wanna Edit Student Details?
              </button>
            )}
            {openEdit && (
              <section className="grid grid-cols-5 gap-x-2 mt-5 relative">
                <Cross
                  className="absolute top-[-40%] rotate-45 cursor-pointer hover:text-delete"
                  onClick={() => setOpenEdit(false)}
                />
                {/* <span className="absolute top-[-40%] right-0 cursor-pointer text-red-400 font-bold text-xs">
                  <div className="flex gap-x-2 items-center">
                    <img
                      src="/drive-logo.svg"
                      alt="drivelogo"
                      className="h-5 w-5"
                    />
                    <span>Only give Google Drive Links</span>
                  </div>
                </span> */}

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm"
                />
                <input
                  type="text"
                  value={rollnumber}
                  onChange={(e) => setRollnumber(e.target.value)}
                  className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm"
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm"
                />

                <input
                  type="text"
                  value={imageUrl}
                  placeholder="Optional Image Url"
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-50 bg-background text-text text-sm mr-2"
                />

                <button
                  className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2"
                  onClick={edit}
                >
                  Edit Details
                </button>
              </section>
            )}
          </section>
          <h1 className="text-3xl font-bold text-text flex items-center mt-4">
            Subject Enrollments{" "}
            <StepForward className="ml-4 h-5 w-5 text-accent group-hover:ml-2 transition-all" />
            <span className="text-background">
              Lorem ipsum dolor sit amet consec
            </span>
          </h1>
          <section className="mt-10">
            <form
              className="flex items-center justify-between"
              onSubmit={addSubject}
            >
              <input
                type="text"
                placeholder="Enter Subject's Name"
                className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-60 bg-background text-text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                required
              />
              <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2">
                Add Subject to the Student
              </button>
            </form>
          </section>
          <section className="mt-10">
            {loading && (
              <div className="">
                <Shell className="h-10 w-10 animate-spin " />
              </div>
            )}

            <div className="grid grid-cols-3  gap-x-11 gap-y-10 mb-4">
              {!loading &&
                currentStudentSubject.map((subject) => (
                  <div
                    key={subject._id}
                    className="bg-secondary text-text p-4 rounded-r-xl w-[100%] hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <Link to={`/subjects/${subject._id}`}>
                        <h1 className="text-text font-bold text-lg uppercase cursor-pointer">
                          {subject.subject_name}
                        </h1>
                      </Link>
                      <button onClick={() => onDelete(subject._id)}>
                        <Trash2 className="hover:text-delete" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 relative">
                      <p className="text text">Current Percentage: </p>
                      <p
                        className={`${
                          subject.grade < 33
                            ? "text-red-400"
                            : "text-emerald-400"
                        } font-bold text-xl cursor-pointer`}
                      >
                        {subject.grade + "%" || "NIL"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {!loading && currentStudentSubject.length === 0 && (
              <h1 className="text-text font-bold text-center mt-10">
                Student is not enrolled in any subject
              </h1>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default PersonalStudent;
