import { useUser } from "@clerk/clerk-react";
import { LogIn, Moon, SunMediumIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const html = document.querySelector("html");

function App() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/students")
      .then((res) => {
        setAllStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(allStudents);

  const [logoColor, setLogoColor] = useState("default");

  const [themeName, setThemeName] = useState("blue");

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

  const handleMutation = (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const updatedClassList = mutation.target.classList.value;
        console.log("Class List Updated:", updatedClassList);

        // You can store the updated class list in state or dispatch an action
        // Example: dispatch({ type: 'UPDATE_CLASS_LIST', payload: updatedClassList });

        if (updatedClassList.includes("pink")) {
          setLogoColor("pink");
        } else if (updatedClassList.includes("green")) {
          setLogoColor("green");
        } else if (updatedClassList.includes("turq")) {
          setLogoColor("turq");
        } else {
          setLogoColor("default");
        }
      }
    });
  };

  useEffect(() => {
    const htmlElement = document.querySelector("html");

    // Create a new MutationObserver
    const observer = new MutationObserver(handleMutation);

    // Configure the observer to watch for changes in attributes
    const config = { attributes: true, subtree: false };

    // Start observing the target node for configured mutations
    observer.observe(htmlElement, config);

    // Clean up the observer when the component unmounts
    return () => observer.disconnect();
  }, []);

  const [studentRollnumber, setStudentRollnumber] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  // const [matchedStudent, setMatchedStudent] = useState({});

  let matchedStudent;

  const handleStudentLogin = (e) => {
    // console.log(studentEmail, studentPassword, studentRollnumber);
    e.preventDefault();
    // console.log(allStudents);

    let flag = false;

    for (let i = 0; i < allStudents.length; i++) {
      if (
        allStudents[i].email === studentEmail &&
        allStudents[i].rollnumber === studentRollnumber
      ) {
        matchedStudent = allStudents[i];
        flag = true;
        break;
      }
    }

    if (flag === false) {
      console.log("No such student found");
    } else {
      if (matchedStudent.password === studentPassword) {
        navigate(`/student-dashboard/${matchedStudent._id}`);
        console.log(matchedStudent);
      } else {
        enqueueSnackbar("Wrong id or password!", { variant: "error" });
      }
    }
  };

  // 72n4jbks
  // hashir0601.be21@chitkara.edu.in

  // hunny0635@chitkara.edu.in
  // vm011b08

  return (
    <main className="bg-background font-poppins">
      <nav className="p-4 flex justify-between">
        <h4 className="text-xl font-bold flex items-center text-text">
          {logoColor === "green" && (
            <img
              src={"/logo-green.svg"}
              height={40}
              width={40}
              alt="logo"
              className="mr-2"
            />
          )}
          {logoColor === "default" && (
            <img
              src={"/logo.svg"}
              height={40}
              width={40}
              alt="logo"
              className="mr-2"
            />
          )}
          {logoColor === "pink" && (
            <img
              src={"/logo-pink.svg"}
              height={40}
              width={40}
              alt="logo"
              className="mr-2"
            />
          )}
          {logoColor === "turq" && (
            <img
              src={"/logo-turq.svg"}
              height={40}
              width={40}
              alt="logo"
              className="mr-2"
            />
          )}
          Learn<span className="text-accent">Hub</span>
        </h4>
        <div className="flex gap-x-2 items-center">
          <div
            className="h-6 w-6 rounded-full bg-[#80b76c]"
            onClick={() => changeTheme()}
          />
          <div
            className="h-6 w-6 rounded-full bg-[#2e7ad1]"
            onClick={() => rechangeTheme()}
          />
          <div
            className="h-6 w-6 rounded-full bg-[#aa3156]"
            onClick={() => changeThemePink()}
          />
          <div
            className="h-6 w-6 rounded-full bg-[#418c90]"
            onClick={() => changeThemeTurq()}
          />
        </div>
        <div
          onClick={() => {
            toggle();
          }}
          className="flex items-center cursor-pointer transition-all mr-3 text-accent"
        >
          <SunMediumIcon className="dark:hidden hover:rotate-180 transition-all" />
          <Moon className="hidden dark:block  transition-all" />
        </div>
      </nav>

      <div className="flex justify-center items-center h-[90vh] flex-col gap-y-4">
        <h1 className="text-6xl font-bold text-text">
          Welcome to Learn<span className="text-accent">Hub</span>{" "}
        </h1>
        <img
          className="dark:hidden"
          src="/documents.png"
          height={300}
          width={300}
          alt=""
        />
        <img
          className="hidden dark:block"
          src="/documents-dark.png"
          height={300}
          width={300}
          alt=""
        />
        <div>
          <h1 className="font-bold text-text text-xl underline">
            As a Teacher
          </h1>
        </div>
        <div className="flex gap-x-4">
          <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2 flex gap-x-1">
            {isSignedIn ? (
              <Link to={"/home"}>Enter LearnHub</Link>
            ) : (
              <Link to="/sign-in">LOGIN</Link>
            )}
            <LogIn />
          </button>

          {!isSignedIn && (
            <button className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2 flex gap-x-1">
              <Link to="/sign-up">SIGNUP</Link>
              <LogIn />
            </button>
          )}
        </div>
        {!isSignedIn && (
          <>
            <div>
              <h1 className="font-bold text-text text-xl underline">
                As a Student
              </h1>
            </div>
            <div className="">
              <form
                className="flex gap-x-4"
                onSubmit={(e) => handleStudentLogin(e)}
              >
                <input
                  type="text"
                  placeholder="Your rollnumber"
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md placeholder:text-sm p-2 mt-2 w-44 bg-background text-text"
                  onChange={(e) => setStudentRollnumber(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Your Email"
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md placeholder:text-sm p-2 mt-2 w-44 bg-background text-text"
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Your password"
                  className="border-2 border-accent placeholder:text-gray-400 rounded-md placeholder:text-sm p-2 mt-2 w-44 bg-background text-text"
                  onChange={(e) => setStudentPassword(e.target.value)}
                  required
                />
                <button
                  className="bg-accent text-text opacity-90 hover:opacity-100 font-bold py-2 px-4 rounded mt-2"
                  type="submit"
                >
                  Login
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
