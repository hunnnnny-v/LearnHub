import axios from "axios";
import { Cross, Menu, Moon, SunMediumIcon, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const html = document.querySelector("html");

const StudentNavbar = ({ setIsOpen, isOpen }) => {
  const [themeName, setThemeName] = useState("blue");

  const params = useParams();

  const changeThemeTurq = () => {
    html.classList.remove("dark");
    html.classList.remove("pink");
    html.classList.remove("pink-dark");
    html.classList.remove("green");
    html.classList.remove("green-dark");
    html.classList.add("turq");
    setThemeName("turq");
  };

  const changeTheme = () => {
    html.classList.remove("dark");
    html.classList.remove("pink");
    html.classList.remove("pink-dark");
    html.classList.remove("turq");
    html.classList.remove("turq-dark");
    html.classList.add("green");
    setThemeName("green");
  };
  const rechangeTheme = () => {
    setThemeName("blue");
    html.classList.remove("green");
    html.classList.remove("green-dark");
    html.classList.remove("pink-dark");
    html.classList.remove("pink");
    html.classList.remove("turq-dark");
    html.classList.remove("turq");
  };

  const changeThemePink = () => {
    html.classList.remove("blue");
    html.classList.remove("dark");
    html.classList.remove("green");
    html.classList.remove("green-dark");
    html.classList.remove("turq");
    html.classList.remove("turq-dark");
    setThemeName("pink");
    html.classList.add("pink");
  };

  const toggle = () => {
    if (themeName === "green") {
      html.classList.toggle("green-dark");
      html.classList.toggle("dark");
    } else if (themeName === "blue") {
      html.classList.toggle("dark");
    } else if (themeName === "pink") {
      html.classList.toggle("pink-dark");
      html.classList.toggle("dark");
    } else {
      html.classList.toggle("turq-dark");
      html.classList.toggle("dark");
    }
  };

  const studentId = params.id;

  const [student, setStudent] = useState({});
  //   const [loading]

  useEffect(() => {
    axios.get(`http://localhost:5555/students/${studentId}`).then((res) => {
      setStudent(res.data);
    });
  }, [studentId]);

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

  return (
    <div className="flex pt-2 justify-between items-center bg-secondary text-accent pb-4 fixed w-full z-40">
      <div
        className="flex mt-2 px-5 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <Cross className="h-8 w-8 rotate-45" />
        ) : (
          <Menu className="h-8 w-8" />
        )}
      </div>
      <div className="flex flex-col gap-y-1 items-center">
        <h1 className="text-xs font-semibold text-accent flex items-center gap-x-1">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Themes
          <span className="h-2 w-2 rounded-full bg-accent" />
        </h1>
        <div className="flex gap-x-2 items-center cursor-pointer">
          <div
            className={`h-5 w-5 rounded-full bg-[#80b76c] ${
              themeName === "green" && "border-2 "
            }`}
            onClick={() => changeTheme()}
          />
          <div
            className={`h-5 w-5 rounded-full bg-[#2e7ad1] ${
              themeName === "blue" && "border-2"
            }`}
            onClick={() => rechangeTheme()}
          />
          <div
            className={`h-5 w-5 rounded-full bg-[#aa3156] ${
              themeName === "pink" && "border-2"
            }`}
            onClick={() => changeThemePink()}
          />
          <div
            className={`h-5 w-5 rounded-full bg-[#26d2e8] ${
              themeName === "turq" && "border-2"
            }`}
            onClick={() => changeThemeTurq()}
          />
        </div>
      </div>

      <div className="gap-x-4 flex mr-2">
        <div
          onClick={() => {
            toggle();
          }}
          className="flex items-center cursor-pointer transition-all mr-3"
        >
          <SunMediumIcon
            id="sun"
            className="dark:invisible hover:rotate-180 transition-all"
          />
          <Moon id="moon" className="invisible dark:visible transition-all" />
        </div>

        <div className="flex gap-x-2">
          {student?.imageUrl?.length !== 0 && (
            <img
              src={student?.imageUrl}
              alt="student_img"
              className="rounded-full h-10 w-10"
            />
          )}

          {student?.imageUrl?.length === 0 && (
            <User className="rounded-full h-6 w-6" />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNavbar;
