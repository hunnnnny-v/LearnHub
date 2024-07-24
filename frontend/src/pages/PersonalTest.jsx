import axios from "axios";
import { BookOpen, ScanBarcode, Shell } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PersonalTest = ({ isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState(false);
  const [testName, setTestName] = useState("");
  const [grade, setGrade] = useState("");
  const { id } = useParams(); //id is extracted
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://localhost:5555/test/${id}`)
      .then((res) => {
        setTest(res.data);
        setLoading(false);
        setTestName(res.data.test_name);
        setGrade(res.data.grade);
      })
      .catch((err) => {
        console.log("Error");
      });
  }, [id]);

  const onUpdate = (e) => {
    e.preventDefault();
    setLoading(true);

    const testId = test._id;
    // console.log(id);

    const inputRegex = /^\d+\/\d+$/; //checks if the grade follows the format of x\y where x and y are positive integers separated by a forward slash.

    const numerator = grade.split("/")[0];
    const denominator = grade.split("/")[1];

    //these above lines extract the num and den from the grade by splitting it using the forward slash.
    if (!inputRegex.test(grade) || +denominator < +numerator) {
      enqueueSnackbar(
        "Format should be x/y , where x should be smaller than y",
        { variant: "error" }
      ); //checks whether the grade matches the expected format and whether the num is smaller than the denominator if not displays an error using enequue loading false and exitss the function
      setLoading(false);
      return;
      // return;
    }

    axios
      .put(`http://localhost:5555/test/${testId}`, {
        grade: grade,
        test_name: testName,
      })
      .then(() => {
        enqueueSnackbar("Test Updated Successfully", { variant: "success" });
        axios
          .get(`http://localhost:5555/test/${testId}`)
          .then((res) => {
            setTest(res.data);
            setGrade(res.data.grade);
            setTestName(res.data.subject_name);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error");
          });
      });
  };

  const onDelete = (id) => {
    axios.delete(`http://localhost:5555/test/${id}`).then(() => {
      enqueueSnackbar("Test Deleted Successfully", { variant: "success" });
      navigate(`/students/${test.student_id}`);
    });
  };

  return (
    <main className={`mt-24 min-h-screen font-poppins ${!isOpen && "mx-auto"}`}>
      {loading && (
        <Shell className="h-12 w-12 animate-spin text-text absolute top-[350px] right-[550px]" />
      )}

      {!loading && (
        <section>
          <div className="flex items-center gap-x-3">
            <h1 className="text-text text-4xl font-semibold">
              {test.test_name}
            </h1>
            <BookOpen className="text-accent h-8 w-8" />
          </div>
          <div className="mt-10 flex items-center gap-x-3">
            <h1 className="text-text text-2xl ">Details About the Test</h1>
            <ScanBarcode className="h-6 w-6 text-accent" />
          </div>

          <div className="grid grid-cols-3 gap-x-4   mt-10">
            <div className="flex flex-col items-center justify-center bg-secondary p-3 rounded-lg">
              <h2 className="text-text font-semibold">Test Id </h2>
              <span className="text-text">{test._id}</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-secondary p-3 rounded-lg">
              <h2 className="text-text font-semibold">Teacher's Id </h2>
              <span className="text-text text-sm">{test.teacher_id}</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-secondary p-3 rounded-lg">
              <h2 className="text-text font-semibold">Conduction Date </h2>
              <span className="text-text">
                {new Date(test.createdAt).toDateString()}
              </span>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="text-text text-2xl flex items-center gap-x-2">
              <span className="text-accent text-sm underline">
                {test.student_id}
              </span>
              {test.student_name}'s Current Test's Report
            </h1>
          </div>

          <div className="mt-10">
            <form
              className="flex gap-x-2 items-center justify-between"
              onSubmit={onUpdate}
            >
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-60 bg-background text-text"
              />
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="border-2 border-accent placeholder:text-text rounded-md p-2 mt-2 w-60 bg-background text-text"
              />
              <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2">
                Update
              </button>
            </form>
          </div>
          <div className="flex items-center justify-center mt-10">
            {/* <button>Delete This Test</button> */}
            <button
              className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2"
              onClick={() => onDelete(test._id)}
            >
              Delete Test
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default PersonalTest;
