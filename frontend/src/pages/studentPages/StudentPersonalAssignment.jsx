import axios from "axios";
import { Bookmark, Clock, Download, FileSignature, Shell } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, useScroll, useSpring } from "framer-motion";

const StudentPersonalAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState([]);

  const { assignmentId, id } = useParams();

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
      pdf.save(`${assignment.topic}-${assignment.subject_name}-assignment.pdf`);
    });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/assignments/${assignmentId}`)
      .then((response) => {
        setAssignment(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [assignmentId]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Render loading state while data is being fetched
  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  // Render nothing if assignment is still undefined
  if (!assignment || !assignment.questions || !assignment.answers) {
    return (
      <Shell className="h-12 w-12 animate-spin text-text absolute top-[350px] right-[550px]" />
    );
  }

  // Create pairs only after assignment and its properties are defined
  const pairs = assignment.questions.map((question, index) => ({
    question: question,
    answer: assignment.answers[index],
  }));

  //   console.log(pairs);

  return (
    <>
      <motion.div className="progress-bar z-50" style={{ scaleX }} />
      <main className="mt-24 font-poppins w-full mr-2">
        {loading && (
          <Shell className="h-12 w-12 animate-spin text-text absolute top-[350px] right-[550px]" />
        )}

        {!loading && (
          <>
            <div ref={pdfRef}>
              <section className="mt-10 mr-4">
                <h1 className="text-4xl font-bold text-text flex  items-center">
                  <Bookmark className="text-accent h-8 w-8 font-bold" />
                  <h1 className="flex justify-between min-w-full items-center">
                    {assignment.topic}{" "}
                    <span className="text-lg text-text">
                      Subject:{" "}
                      <span className="text-accent">
                        {assignment.subject_name}
                      </span>
                    </span>
                  </h1>
                </h1>
              </section>
              <section className="mt-10 flex justify-between items-center gap-x-[450px]">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-text">
                    Created On:{" "}
                    <span className="text-accent">
                      {new Date(assignment.createdAt).toDateString()}
                    </span>
                  </h3>
                  {id === assignment.teacher_id && (
                    <h3 className="text-xl font-semibold text-text flex items-center mt-3">
                      Updated On:
                      <span className="text-accent flex items-center ml-1">
                        {new Date(assignment.updatedAt).toDateString()}
                        <span className="ml-2 text-sm flex items-center">
                          <Clock className="h-4 w-4" />(
                          {new Date(assignment.updatedAt).getHours()}:
                          {new Date(assignment.updatedAt).getMinutes()})
                        </span>
                      </span>
                    </h3>
                  )}
                </div>
                <h3 className="text-xl font-semibold mr-4">
                  <span className="text-text">By </span>
                  <span className="text-accent">
                    {id === assignment.teacher_id
                      ? "You"
                      : assignment.teacher_name}
                  </span>
                </h3>
              </section>

              <section className="mt-10">
                <div
                  className={`${
                    assignment.category === "Easy"
                      ? "border-emerald-400"
                      : assignment.category === "Hard"
                      ? "border-red-400"
                      : "border-yellow-400"
                  } flex items-center justify-between border-l-4 p-1 text-md font-bold`}
                >
                  <h1 className="text-text ml-2">
                    Difficulty:{" "}
                    <span
                      className={`${
                        assignment.category === "Easy"
                          ? "text-emerald-400"
                          : assignment.category === "Hard"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {assignment.category}
                    </span>
                  </h1>
                  {id === assignment.teacher_id && (
                    <NavLink
                      to={`/assignments/edit/${id}`}
                      className="bg-accent text-text opacity-90 hover:opacity-100  py-2 px-4 rounded mt-2 mr-2 gap-x-2 flex items-center"
                    >
                      <FileSignature className="h-4 w-4" />
                      <span className="text-text text-md">Edit</span>
                    </NavLink>
                  )}
                </div>
              </section>

              <section className="mt-10 flex items-center justify-start">
                <div
                  className={`
          ${
            assignment.category === "Easy"
              ? "border-emerald-400"
              : assignment.category === "Hard"
              ? "border-red-400"
              : "border-yellow-400"
          }
          text-text p-4 mb-1 border-l-4 flex flex-col gap-y-6`}
                >
                  {pairs.map((pair, index) => (
                    <div className="flex flex-col">
                      <h1 className="flex gap-x-1 items-center">
                        <span className="font-bold text-4xl text-accent">
                          Q
                        </span>
                        <span className="font-semibold text-xl">
                          {pair.question}
                        </span>
                      </h1>
                      <h3 className="flex gap-x-1 items-center">
                        <span className="text-accent font-bold text-md">-</span>
                        <span className="text-lg">{pair.answer}</span>
                      </h3>
                      <hr className="mt-3 w-[100%]" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="flex items-center justify-center dark:hidden">
              <button
                className="bg-accent text-text opacity-90 hover:opacity-100  py-2 px-4 rounded mt-2 mr-2 gap-x-2 flex items-center mb-2"
                onClick={downloadPDF}
              >
                <Download />
                Download
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default StudentPersonalAssignment;
