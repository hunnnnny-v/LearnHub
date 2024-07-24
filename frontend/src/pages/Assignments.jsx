import { useAuth, useUser } from "@clerk/clerk-react";
import {
  DatabaseBackup,
  DatabaseZap,
  FilePlus2,
  Shell,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { NavLink } from "react-router-dom";

const Assignments = () => {
  const [isNotesInputOpen, setNotesInputOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState(""); // Initialize as string
  const [answers, setAnswers] = useState(""); // Initialize as string
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const [userAssignments, setUserAssignments] = useState([]);

  const user = useUser();
  const fullName = user.user.fullName;

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5555/assignments").then((res) => {
      setUserAssignments(
        res.data.filter((assignment) => assignment.teacher_id === userId)
      );
      setLoading(false);
    });
  }, [userId]);

  const submitForm = (e) => {
    e.preventDefault();

    const questionsArray = questions.split("\n");
    const answersArray = answers.split("\n");

    if (questionsArray.length !== answersArray.length) {
      enqueueSnackbar("Number of questions and answers should be the same", {
        variant: "warning",
      });
      return;
    }

    setLoading(true);

    axios
      .post("http://localhost:5555/assignments", {
        subject_name: subjectName.toUpperCase(),
        teacher_name: fullName,
        teacher_id: userId,
        topic: topic,
        category: category,
        questions: questionsArray,
        answers: answersArray,
      })
      .then(() => {
        enqueueSnackbar("Assignment Posted Successfully", {
          variant: "success",
        });
        setNotesInputOpen(false);
        axios.get("http://localhost:5555/assignments").then((res) => {
          setUserAssignments(
            res.data.filter((assignment) => assignment.teacher_id === userId)
          );
          setLoading(false);
        });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Error Posting Assignment", { variant: "error" });
        setLoading(false);
      });
  };

  const onDelete = (id) => {
    setLoading(true);

    axios
      .delete(`http://localhost:5555/assignments/${id}`)
      .then(() => {
        enqueueSnackbar("Assignment Deleted Successfully", {
          variant: "success",
        });
        axios
          .get("http://localhost:5555/assignments")
          .then((res) => {
            setUserAssignments(
              res.data.filter((assignment) => assignment.teacher_id === userId)
            );
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar("Error Deleting Assignment", { variant: "error" });
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Error Deleting Assignment", { variant: "error" });
        setLoading(false);
      });
  };

  return (
    <main className="mt-24 min-h-screen font-poppins w-full mr-2">
      {loading && (
        <Shell className="h-16 w-16 text-text animate-spin absolute left-[400px] top-[40%]" />
      )}

      <section>
        <h1 className="text-2xl font-bold text-text flex gap-x-2 items-center">
          <DatabaseZap className="text-accent" />
          Create And Download Assignments
        </h1>
      </section>
      {!loading && (
        <>
          <section className="mt-10 flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
              <h1 className="text-text uppercase text-xl font-bold">
                Create Assignment
              </h1>
              <FilePlus2
                className="text-accent h-6 w-6 cursor-pointer"
                onClick={() => setNotesInputOpen((prev) => !prev)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <h1 className="text-text border-l-4 border-emerald-400 p-1">
                Easy
              </h1>
              <h1 className="text-text border-l-4 border-yellow-400 p-1">
                Medium
              </h1>
              <h1 className="text-text border-l-4 border-red-400 p-1">Hard</h1>
            </div>
          </section>

          {isNotesInputOpen && (
            <section className="mt-10 mr-4">
              <form
                className="flex flex-col justify-center items-center gap-y-4"
                onSubmit={submitForm}
              >
                <input
                  type="text"
                  placeholder="Subject Name..."
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Topic..."
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Difficulty ['Easy' , 'Medium' , 'Hard']..."
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
                <span className="text-red-700">
                  Please write the question and answer in sequence
                </span>
                <textarea
                  cols="3"
                  rows="3"
                  placeholder="Questions? (Each question on separate line)"
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  required
                ></textarea>

                <textarea
                  cols="3"
                  rows="3"
                  placeholder="Answers! (Each answer on separate line)"
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
                  value={answers}
                  onChange={(e) => setAnswers(e.target.value)}
                  required
                ></textarea>

                <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2">
                  Publish Notes
                </button>
              </form>
            </section>
          )}

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
                  <NavLink key={notes._id} to={`/assignments/${notes._id}`}>
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
                          <span>You ({notes.teacher_name})</span>
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                  <Trash2
                    className="ml-2 hover:text-delete cursor-pointer text-text"
                    onClick={() => onDelete(notes._id)}
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Assignments;
