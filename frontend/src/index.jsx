import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { HMSRoomProvider } from "@100mslive/react-sdk";

import { ClerkProvider, SignIn, SignUp, SignedIn } from "@clerk/clerk-react";
import SidebarOne from "./Home/_components/Sidebar";
import Navbar from "./Home/_components/Navbar";
import Student from "./pages/Student";
import { SnackbarProvider } from "notistack";
import Home from "./Home/Home";
import PersonalStudent from "./pages/PersonalStudent";
import PersonalSubject from "./pages/PersonalSubject";
import Notes from "./pages/Notes";
import PersonalNotes from "./pages/PersonalNotes";
import EditNotes from "./pages/EditNotes";
import PersonalTest from "./pages/PersonalTest";
import Attendance from "./pages/Attendance";
import SubjectAttendance from "./pages/SubjectAttendance";
import Report from "./pages/Report";
import Assignments from "./pages/Assignments";
import PersonalAssignment from "./pages/PersonalAssignment";
import EditAssignments from "./pages/EditAssignments";
import Video from "./pages/video-call/Video";
import ClassView from "./pages/ClassView";
import SubjectView from "./pages/SubjectView";
import Planner from "./pages/Planner/Planner";
import StudentNavbar from "./Home/_components/StudentNavbar";
import StudentSidebarOne from "./Home/_components/StudentSidebar";
import StudentVideo from "./pages/video-call/StudentVideo";
import StudentNotes from "./pages/studentPages/StudentNotes";
import PersonalStudentNotes from "./pages/studentPages/StudentPersonalNotes";
import StudentAssignments from "./pages/studentPages/StudentAssignment";
import StudentPersonalAssignment from "./pages/studentPages/StudentPersonalAssignment";
import StudentPlanner from "./pages/studentPages/StudentPlanner";
import StudentHome from "./pages/studentPages/StudentHome";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById("root"));

const ClerkWithRoutes = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/sign-in/*"
          element={
            <div className="flex justify-center items-center h-screen">
              <SignIn redirectUrl={"/home"} routing="path" path="/sign-in" />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="flex justify-center items-center h-screen">
              <SignUp redirectUrl={"/home"} routing="path" path="/sign-up" />
            </div>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <Home isOpen={isOpen} />
                </div>
              </SignedIn>
            </>
          }
        />
        <Route
          path="/students"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <Student isOpen={isOpen} />
                </div>
              </SignedIn>
            </>
          }
        />
        <Route
          path="/students/:id"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <PersonalStudent isOpen={isOpen} />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/subjects/:id"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <PersonalSubject isOpen={isOpen} />
                </div>
              </SignedIn>
            </>
          }
        />
        <Route
          path="/test/:id"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <PersonalTest isOpen={isOpen} />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/notes"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <Notes />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/notes/:id"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <PersonalNotes />
                </div>
              </SignedIn>
            </>
          }
        />
        <Route
          path="/notes/edit/:id"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <EditNotes />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/attendance"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background min-h-screen">
                  <SidebarOne isOpen={isOpen} />
                  <Attendance isOpen={isOpen} />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/attendance/:id"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <div className="flex flex-col gap-y-10">
                    <Attendance isOpen={isOpen} />
                    <SubjectAttendance />
                  </div>
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/reports"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <Report isOpen={isOpen} />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/assignments"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <Assignments />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/assignments/:id"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background min-h-screen">
                  <SidebarOne isOpen={isOpen} />
                  <PersonalAssignment />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/assignments/edit/:id"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background min-h-screen">
                  <SidebarOne isOpen={isOpen} />
                  <EditAssignments />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/video-call"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background min-h-screen">
                  <SidebarOne isOpen={isOpen} />
                  <Video />
                </div>
              </SignedIn>
            </>
          }
        />
        <Route
          path="/class-view"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background min-h-screen">
                  <SidebarOne isOpen={isOpen} />
                  <ClassView isOpen={isOpen} />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/class-view/:id"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background">
                  <SidebarOne isOpen={isOpen} />
                  <div
                    className={`flex flex-col gap-y-10 ${
                      !isOpen && "w-full mx-auto mr-4"
                    }`}
                  >
                    <ClassView isOpen={isOpen} />
                    <SubjectView isOpen={isOpen} />
                  </div>
                </div>
              </SignedIn>
            </>
          }
        />
        <Route
          path="/planner"
          element={
            <>
              <SignedIn>
                <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
                <div className="flex gap-x-12 bg-background w-full">
                  <SidebarOne isOpen={isOpen} />
                  <Planner isOpen={isOpen} />
                </div>
              </SignedIn>
            </>
          }
        />

        <Route
          path="/student-dashboard/:id"
          element={
            <>
              <StudentNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
              <div className="flex gap-x-12 bg-background w-full">
                <StudentSidebarOne isOpen={isOpen} />
                <StudentHome />
              </div>
            </>
          }
        />
        <Route
          path="/student-dashboard/video/:id"
          element={
            <>
              <StudentNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
              <div className="flex gap-x-12 bg-background w-full h-[100vh]">
                <StudentSidebarOne isOpen={isOpen} />
                <StudentVideo />
              </div>
            </>
          }
        />
        <Route
          path="/student-dashboard/notes/:id"
          element={
            <>
              <StudentNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
              <div className="flex gap-x-12 bg-background w-full ">
                <StudentSidebarOne isOpen={isOpen} />
                <StudentNotes />
              </div>
            </>
          }
        />
        <Route
          path="/student-dashboard/assignment/:id"
          element={
            <>
              <StudentNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
              <div className="flex gap-x-12 bg-background w-full ">
                <StudentSidebarOne isOpen={isOpen} />
                <StudentAssignments />
              </div>
            </>
          }
        />
        <Route
          path="/student-dashboard/:id/:notesId"
          element={
            <>
              <StudentNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
              <div className="flex gap-x-12 bg-background w-full ">
                <StudentSidebarOne isOpen={isOpen} />
                <PersonalStudentNotes />
              </div>
            </>
          }
        />
        <Route
          path="/student-dashboard/assignment/:id/:assignmentId"
          element={
            <>
              <StudentNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
              <div className="flex gap-x-12 bg-background w-full ">
                <StudentSidebarOne isOpen={isOpen} />
                <StudentPersonalAssignment />
              </div>
            </>
          }
        />

        <Route
          path="/student-dashboard/planner/:id"
          element={
            <>
              <StudentNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
              <div className="flex gap-x-12 bg-background w-full ">
                <StudentSidebarOne isOpen={isOpen} />
                {/* <StudentAssignments /> */}
                <StudentPlanner isOpen={isOpen} />
              </div>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <HMSRoomProvider>
          <ClerkWithRoutes />
        </HMSRoomProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
