// import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import JoditEditor from "jodit-react"; //js editor that allows users to create and edit rich text content .
import { FileSignature, Shell } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditNotes = () => {
  const { id } = useParams();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({});
  const navigate = useNavigate();
  const [heading, setHeading] = useState("");
  const [category, setCategory] = useState("");
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/notes/${id}`)
      .then((response) => {
        setLoading(false);
        setNotes(response.data);
        setHeading(response.data.heading);
        setCategory(response.data.category);
        setSubjectName(response.data.subject_name);
        setContent(response.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]); //when id dependeny changes the set loading is true sends a get req to fetch note and updates the state variable .

  const handleUpdate = (e) => {
    //update the notes
    e.preventDefault();

    const notes_id = notes._id; //extracts the id from notes object that needs to be updates

    setLoading(true);

    axios
      .put(`http://localhost:5555/notes/edit/${notes_id}`, {
        //put req is sent to serve saying that update is required at mentioned notes_id
        subject_name: subjectName,
        heading: heading,
        category: category,
        content: content,
      })
      .then(() => {
        enqueueSnackbar("Notes Updated Successfully", { variant: "success" });
        axios
          .get(`http://localhost:5555/notes/${id}`) //fetches th updated notes details
          .then((response) => {
            setNotes(response.data);
            setHeading(response.data.heading);
            setCategory(response.data.category);
            setSubjectName(response.data.subject_name);
            setContent(response.data.content);
            setLoading(false); //after the update is successful
            navigate(`/notes/${id}`); //navigates to new url of updated one
          })
          .catch((err) => {
            console.log("Error");
          });
      });
  };

  // console.log(notes);

  return (
    <main className="mt-24 min-h-screen font-poppins relative mb-2 mr-4">
      {loading && (
        <Shell className="h-16 w-16 text-text animate-spin absolute left-[400px] top-[40%]" />
      )}

      {!loading && (
        <section className="mt-10">
          <h1 className="text-2xl text-text font-semibold mb-4 flex items-center">
            <FileSignature className="mr-3 h-12 w-12 text-accent" />
            You are currently Editing:{" "}
            <span className="text-accent ml-2 mr-2">
              {notes.heading}
            </span> from{" "}
            <span className="text-accent ml-2">{notes.subject_name}</span>
          </h1>
          <form
            className="flex flex-col justify-center items-center gap-y-4"
            onSubmit={handleUpdate}
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
            <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2 flex gap-x-2">
              Edit and Publish Notes
              <FileSignature />
            </button>
          </form>
        </section>
      )}
    </main>
  );
};

export default EditNotes;
