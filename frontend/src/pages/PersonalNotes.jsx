import axios from "axios";
import { Bookmark, Clock, Download, FileSignature, Shell } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, useScroll, useSpring } from "framer-motion";

const PersonalNotes = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({});
  const { userId } = useAuth();

  const pdfRef = useRef();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/notes/${id}`)
      .then((response) => {
        setLoading(false);
        setNotes(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

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
      pdf.save(`${notes.heading}.pdf`);
    });
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div className="progress-bar z-50" style={{ scaleX }} />
      <main className="mt-24 min-h-screen font-poppins w-full">
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
                    {notes.heading}
                    {/* .charAt(0).toUpperCase() + */}
                    {/* notes.heading.slice(1)} */}{" "}
                    <span className="text-lg text-text">
                      Subject:{" "}
                      <span className="text-accent">
                        {notes.subject_name}
                        {/* .charAt(0).toUpperCase() + */}
                        {/* notes.subject_name.slice(1)} */}
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
                      {new Date(notes.createdAt).toDateString()}
                    </span>
                  </h3>
                  {userId === notes.teacher_id && (
                    <h3 className="text-xl font-semibold text-text flex items-center mt-3">
                      Updated On:
                      <span className="text-accent flex items-center ml-1">
                        {new Date(notes.updatedAt).toDateString()}
                        <span className="ml-2 text-sm flex items-center">
                          <Clock className="h-4 w-4" />(
                          {new Date(notes.updatedAt).getHours()}:
                          {new Date(notes.updatedAt).getMinutes()})
                        </span>
                      </span>
                    </h3>
                  )}
                </div>
                <h3 className="text-xl font-semibold mr-4">
                  <span className="text-text">By </span>
                  <span className="text-accent">
                    {userId === notes.teacher_id ? "You" : notes.teacher_name}
                  </span>
                </h3>
              </section>

              <section className="mt-10">
                <div
                  className={`${
                    notes.category === "Easy"
                      ? "border-emerald-400"
                      : notes.category === "Hard"
                      ? "border-red-400"
                      : "border-yellow-400"
                  } flex items-center justify-between border-l-4 p-1 text-md font-bold`}
                >
                  <h1 className="text-text ml-2">
                    Difficulty:{" "}
                    <span
                      className={`${
                        notes.category === "Easy"
                          ? "text-emerald-400"
                          : notes.category === "Hard"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {notes.category}
                    </span>
                  </h1>
                  {userId === notes.teacher_id && (
                    <NavLink
                      to={`/notes/edit/${id}`}
                      className="bg-accent text-text opacity-90 hover:opacity-100  py-2 px-4 rounded mt-2 mr-2 gap-x-2 flex items-center"
                    >
                      <FileSignature className="h-4 w-4" />
                      <span className="text-text text-md">Edit</span>
                    </NavLink>
                  )}
                </div>
              </section>

              <section className="mt-10 flex items-center justify-center">
                <div
                  className={`
              ${
                notes.category === "Easy"
                  ? "border-emerald-400"
                  : notes.category === "Hard"
                  ? "border-red-400"
                  : "border-yellow-400"
              }
              text-text p-4 ml-2 mb-1 border-l-4 `}
                  dangerouslySetInnerHTML={{ __html: notes.content }}
                ></div>
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

export default PersonalNotes;
