import { UserButton } from "@clerk/clerk-react";
import {
  Newspaper,
  Home,
  DatabaseZap,
  Antenna,
  AlarmClock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const StudentSidebarOne = ({ isOpen }) => {
  const [logoColor, setLogoColor] = useState("default");

  const params = useParams();

  const studentId = params.id;
  const navigate = useNavigate();

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

  return (
    <div className="pt-2.5">
      {isOpen && (
        <aside className="flex min-h-full   w-64 flex-col overflow-y-auto border-r bg-secondary px-5 py-4 transition-all  text-text font-poppins">
          <div className="flex items-center justify-start  font-bold mt-14">
            <NavLink to={"/home"}>
              <h1 className="font-extrabold text-text text-4xl font-poppins flex items-center">
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
              </h1>
            </NavLink>
          </div>
          <div className="mt-6 flex flex-1 flex-col justify-between">
            <nav className="-mx-3 space-y-6 ">
              <div className="space-y-3 ">
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive ? " border-r-8 border-accent" : ""
                    } flex transform items-center rounded-lg px-3 py-2 text-text  duration-300 hover:bg-gray-100 hover:text-gray-700 mb-4`
                  }
                  to={`/student-dashboard/${studentId}`}
                >
                  <Home className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="mx-2 text-sm font-medium">Home</span>
                </NavLink>
                <label className="px-3 text-xs font-semibold uppercase text-text">
                  classroom
                </label>
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive ? " border-r-8 border-accent" : ""
                    } flex transform items-center rounded-lg px-3 py-2 text-text  duration-300 hover:bg-gray-100 hover:text-gray-700 mb-4`
                  }
                  to={`/student-dashboard/video/${studentId}`}
                >
                  <Antenna className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="mx-2 text-sm font-medium">Video Call</span>
                </NavLink>
              </div>
              <div className="space-y-3 ">
                <label className="px-3 text-xs font-semibold uppercase text-text">
                  content
                </label>
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive ? "border-r-8 border-accent" : ""
                    } flex transform items-center rounded-lg px-3 py-2 text-text  duration-300 hover:bg-gray-100 hover:text-gray-700 `
                  }
                  to={`/student-dashboard/notes/${studentId}`}
                >
                  <Newspaper
                    className="h-5 w-5 text-accent"
                    aria-hidden="true"
                  />
                  <span className="mx-2 text-sm font-medium ">Notes</span>
                </NavLink>

                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive ? "border-r-8 border-accent" : ""
                    } flex transform items-center rounded-lg px-3 py-2 text-text  duration-300 hover:bg-gray-100 hover:text-gray-700 `
                  }
                  to={`/student-dashboard/assignment/${studentId}`}
                >
                  <DatabaseZap
                    className="h-5 w-5 text-accent"
                    aria-hidden="true"
                  />
                  <span className="mx-2 text-sm font-medium ">Assignments</span>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive ? "border-r-8 border-accent" : ""
                    } flex transform items-center rounded-lg px-3 py-2 text-text  duration-300 hover:bg-gray-100 hover:text-gray-700 `
                  }
                  to={`/student-dashboard/planner/${studentId}`}
                >
                  <AlarmClock
                    className="h-5 w-5 text-accent"
                    aria-hidden="true"
                  />
                  <span className="mx-2 text-sm font-medium ">Planner</span>
                </NavLink>
              </div>
            </nav>
          </div>
          <div className="flex gap-x-2 items-center">
            <UserButton />
            <button
              onClick={() => {
                navigate(`/`);
              }}
              className="bg-accent text-text opacity-90 hover:opacity-100  py-2 px-4 rounded mt-2 mr-2 gap-x-2 flex items-center mb-2"
            >
              Logout Here!
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default StudentSidebarOne;
