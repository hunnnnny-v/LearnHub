import { FileSignature, Shell } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const EditAssignments = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  let [questions, setQuestions] = useState("");
  let [answers, setAnswers] = useState("");
  const [assignment, setAssignment] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //fetches the ass details
    setLoading(true);
    axios
      .get(`http://localhost:5555/assignments/${id}`) //sends get req to url to fetch details for specific id
      .then((response) => {
        setLoading(false);
        setAssignment(response.data);
        setTopic(response.data.topic);
        setCategory(response.data.category);
        setSubjectName(response.data.subject_name);
        setAnswers(response.data.answers);
        setQuestions(response.data.questions);
      }) //these all set pieces of data from the res to their respective state variables
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const assignment_id = assignment._id; //extracts the id prop from ass object

    setLoading(true); //updation is under progress
    // questions = questions.split("\n");
    // answers = answers.split("\n");

    axios
      .put(`http://localhost:5555/assignments/edit/${assignment_id}`, {
        //put req for updation at a specific id
        subject_name: subjectName,
        topic: topic,
        category: category,
        questions: questions,
        answers: answers,
      })
      .then(() => {
        enqueueSnackbar("Assignment Updated Successfully", {
          variant: "success",
        });
        axios
          .get(`http://localhost:5555/assignments/${assignment_id}`)
          .then((response) => {
            setAssignment(response.data);
            setTopic(response.data.topic);
            setCategory(response.data.category);
            setSubjectName(response.data.subject_name);
            setQuestions(response.data.questions);
            setAnswers(response.data.answers);
            setLoading(false);
            navigate(`/assignments/${id}`);
          })
          .catch((err) => {
            console.log("Error");
          });
      });
  };

  if (!assignment || !assignment.questions || !assignment.answers) {
    return (
      <Shell className="h-12 w-12 animate-spin text-text absolute top-[350px] right-[550px]" />
    );
  }

  const len = assignment.questions.length;

  console.log(answers, questions);

  return (
    <main className="mt-24 min-h-screen font-poppins relative mb-2 mr-4 w-full">
      {loading && (
        <Shell className="h-16 w-16 text-text animate-spin absolute left-[400px] top-[40%]" />
      )}

      {!loading && (
        <section className="mt-10">
          <h1 className="text-2xl text-text font-semibold mb-4 flex items-center">
            <FileSignature className="mr-3 h-12 w-12 text-accent" />
            You are currently Editing:{" "}
            <span className="text-accent ml-2 mr-2">
              {assignment.topic} assignment
            </span>{" "}
            from{" "}
            <span className="text-accent ml-2">{assignment.subject_name}</span>
          </h1>
          <form
            className="flex flex-col justify-center items-center gap-y-4"
            // onSubmit={handleUpdate}
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
              placeholder="Topic..."
              className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <input
              type="text"
              placeholder="Difficulty ['Easy' , 'Medium' , 'Hard']..."
              className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className="text-red-700">
              Please write the question and answer in sequence
            </span>
            <textarea
              cols="3"
              rows={len}
              placeholder="Questions? (Each question on seperate line)"
              className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
              value={questions.join("\n")}
              onChange={(e) => setQuestions(e.target.value.split("\n"))}
              required
            ></textarea>

            <textarea
              cols="3"
              rows={len}
              placeholder="Answers! (Each answer on seperate line)"
              className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 bg-background text-text w-full"
              value={answers.join("\n")}
              onChange={(e) => setAnswers(e.target.value.split("\n"))}
              required
            ></textarea>

            <button
              className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2 flex gap-x-2"
              onClick={(e) => handleUpdate(e)}
            >
              Edit and Publish assignment
              <FileSignature />
            </button>
          </form>
        </section>
      )}
    </main>
  );
};

export default EditAssignments;
