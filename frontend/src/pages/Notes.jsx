import { FilePlus2, ScrollText, Shell, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { enqueueSnackbar } from "notistack";
import { NavLink } from "react-router-dom";

const Notes = () => {
  const [isNotesInputOpen, setNotesInputOpen] = useState(false);

  const user = useUser();
  const fullName = user.user.fullName;

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const { userId } = useAuth();
  const [heading, setHeading] = useState("");
  const [category, setCategory] = useState("");
  const [subjectName, setSubjectName] = useState("");

  //   console.log(content);

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://localhost:5555/notes")
      .then((res) => {
        setAllNotes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const otherTeacherNotes = allNotes.filter(
    (grade) => grade.teacher_id !== userId
  ); //filters allnotes to include only those whose teacherid is diff from the userid.

  const userNotes = allNotes.filter((notes) => notes.teacher_id === userId); //if teacherid matches the userid then add

  //   console.log(otherTeacherNotes);

  const difficultyVariations = [
    "Easy",
    "EASY",
    "eAsY",
    "eASY",
    "easy",
    "Medium",
    "MEDIUM",
    "mEdIuM",
    "mEDIUM",
    "medium",
    "Hard",
    "HARD",
    "hArD",
    "hARD",
    "hard",
  ];

  const submitForm = (e) => {
    e.preventDefault();
    // console.log(heading, category, content);

    if (!difficultyVariations.includes(category)) {
      enqueueSnackbar("The difficulty can only be Easy , Medium or Hard", {
        variant: "warning", //checks if category provided is valid if it exists in difficultyVariations and if not then displays the warning message
      });
      return;
    }

    setLoading(true); //publishing is in progress

    axios
      .post("http://localhost:5555/notes", {
        teacher_id: userId,
        teacher_name: fullName,
        subject_name: subjectName,
        heading: heading,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        content: content,
      })
      .then(() => {
        enqueueSnackbar("Notes Published Successfully", {
          variant: "success",
        });
        setNotesInputOpen(false);
        axios.get(`http://localhost:5555/notes`).then((res) => {
          // console.log(res.data);
          setLoading(false);
          setAllNotes(res.data);
          setSubjectName("");
          setHeading("");
          setCategory("");
        });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Error Publishing Notes", { variant: "error" });
      });
  };

  // console.log(allNotes);

  const onDelete = (id) => {
    setLoading(true);

    axios
      .delete(`http://localhost:5555/notes/${id}`)
      .then(() => {
        // setLoading(false);
        console.log("Notes Unpublished Successfully");
        enqueueSnackbar("Notes Unpublished Successfully", {
          variant: "success",
        });
        axios
          .get("http://localhost:5555/notes")
          .then((res) => {
            setAllNotes(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar("Error Unpublishing Notes", { variant: "error" });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main className="mt-24 min-h-screen font-poppins relative w-full">
      {loading && (
        <Shell className="h-16 w-16 text-text animate-spin absolute left-[400px] top-[40%]" />
      )}
      {!loading && (
        <>
          <section className="flex flex-col gap-y-4">
            <h1 className="text-3xl font-bold text-text">
              Notes{" "}
              <span className="text-background">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </span>
            </h1>
            <div className="flex gap-x-3 items-center">
              <h3 className="text-text text-xl ">
                Create and read all of notes
              </h3>
              <ScrollText className="text-accent h-5 w-5" />
            </div>
          </section>

          <section className="mt-10 flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
              <h1 className="text-text uppercase text-xl font-bold">
                Add your notes
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
                />
                <input
                  type="text"
                  placeholder="Title..."
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Difficulty ['Easy' , 'Medium' , 'Hard']..."
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <JoditEditor
                  ref={editor}
                  value={content}
                  onChange={(newContent) => setContent(newContent)}
                />
                <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2">
                  Publish Notes
                </button>
              </form>
            </section>
          )}

          <section className="mt-10">
            <div>
              <h1 className="text-text text-2xl font-bold">Your Notes</h1>
              <p className="text-accent">All your notes at one place !</p>
            </div>
            <div className="mt-6 flex flex-col gap-y-4">
              {userNotes.length === 0 && (
                <div>
                  <h1 className="text-red-400 font-bold">
                    You haven't published any notes
                  </h1>
                </div>
              )}
              {userNotes.map((notes) => (
                <div key={notes._id}>
                  <NavLink key={notes._id} to={`/notes/${notes._id}`}>
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
                          <ScrollText className="text-text" />
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
                          {notes.heading.charAt(0).toUpperCase() +
                            notes.heading.slice(1)}
                          <span className="text-sm text-text underline">
                            {notes.subject_name.charAt(0).toUpperCase() +
                              notes.subject_name.slice(1)}
                          </span>
                        </h1>
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

          <section className="mt-10">
            <div>
              <h1 className="text-text text-2xl font-bold">
                Other Teacher's Notes
              </h1>
              <p className="text-accent">
                One must know what their collegues are teaching!
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-y-4 mb-2">
              {otherTeacherNotes.map((notes) => (
                <NavLink key={notes._id} to={`/notes/${notes._id}`}>
                  <div
                    className={` ${
                      notes.category === "Easy"
                        ? "border-emerald-400"
                        : notes.category === "Hard"
                        ? "border-red-400"
                        : "border-yellow-400"
                    } border-accent border-l-4 p-4 flex items-center cursor-pointer`}
                  >
                    <div className="flex items-center">
                      <div className="rounded-full h-16 w-16 bg-accent flex items-center justify-center">
                        <ScrollText className="text-text" />
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
                        {notes.heading}
                        <span className="text-sm text-text underline">
                          {notes.subject_name}
                        </span>
                      </h1>
                    </div>
                    <div className="ml-auto flex flex-col gap-y-2 items-center">
                      <h1 className="font-semibold text-text">Author: </h1>
                      <h3 className="font-bold text-accent">
                        {notes.teacher_name}
                      </h3>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Notes;
