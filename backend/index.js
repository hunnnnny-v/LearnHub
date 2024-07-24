import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import { Student } from "./models/studentModel.js";
import cors from "cors";
import { Subject } from "./models/subjectModel.js";
import { Test } from "./models/testModel.js";
import { Notes } from "./models/notesModel.js";
import { Attendance } from "./models/attendanceModel.js";
import { Assignment } from "./models/assignmentModel.js";
import { Task } from "./models/taskModel.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

//////////////////////////////students api///////////////////////////////////////

app.post("/students", async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.rollnumber ||
      !req.body.teacher_id
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStudent = {
      teacher_id: req.body.teacher_id,
      name: req.body.name,
      email: req.body.email,
      rollnumber: req.body.rollnumber,
      password: req.body.password,
      imageUrl: req.body.imageUrl || "image link would be here",
      teacher_email: req.body.teacher_email || "",
    };

    const student = await Student.create(newStudent);
    return res.status(201).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find({}).sort({ name: 1 });
    return res.status(200).json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Student removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    return res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedStudent = await Student.findByIdAndUpdate(id, req.body);

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student Not Found" });
    }

    return res.status(200).send({ message: "Student Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/students/student/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.find({ rollnumber: id });

    return res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//////////////////////////////////Subject api's/////////////////////////////////

app.post("/subjects", async (req, res) => {
  try {
    if (
      !req.body.student_id ||
      !req.body.subject_name ||
      !req.body.rollnumber ||
      !req.body.teacher_id
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSubject = {
      teacher_id: req.body.teacher_id,
      student_id: req.body.student_id,
      rollnumber: req.body.rollnumber,
      subject_name: req.body.subject_name,
      grade: req.body.grade || "A",
    };

    const subject = await Subject.create(newSubject);
    return res.status(201).json(subject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find({}).sort({ createdAt: -1 });
    return res.status(200).json(subjects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/subjects/:id", async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Subject removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/subjects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);

    return res.status(200).json(subject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/subjects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSubject = await Subject.findByIdAndUpdate(id, req.body);

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject Not Found" });
    }

    return res.status(200).send({ message: "Subject Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

///////////////////////////////task api's///////////////////////////////

app.post("/task", async (req, res) => {
  try {
    if (!req.body.task_name || !req.body.task_date || !req.body.user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTask = {
      user_id: req.body.user_id,
      task_name: req.body.task_name,
      task_date: req.body.task_date,
      task_category: req.body.task_category || "ANONYMOUS",
      task_completed: req.body.task_completed,
      task_completed_on: req.body.task_completed_on || "Not set",
    };

    const task = await Task.create(newTask);
    return res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/task/:id", async (req, res) => {
  try {
    const task = await Task.find({ user_id: req.params.id }).sort({
      task_date: 1,
    });
    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/task/find/:id", async (req, res) => {
  try {
    const task = await Task.find({ task_category: req.params.id }).sort({
      task_date: 1,
    });
    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/task/edit/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Task Removed removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(id, req.body);

    if (!updatedTask) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    return res.status(200).send({ message: "Task Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

////////////////////////////////// test api's///////////////////////////////
app.post("/subjects/testgrade", async (req, res) => {
  try {
    if (
      !req.body.subject_name ||
      !req.body.subject_id ||
      !req.body.student_name ||
      !req.body.student_id ||
      !req.body.teacher_id ||
      !req.body.grade ||
      !req.body.test_name
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTestGrade = {
      teacher_id: req.body.teacher_id,
      student_id: req.body.student_id,
      student_name: req.body.student_name,
      subject_id: req.body.subject_id,
      subject_name: req.body.subject_name,
      grade: req.body.grade,
      test_name: req.body.test_name,
    };

    const testgrade = await Test.create(newTestGrade);
    return res.status(201).json(testgrade);
  } catch (error) {}
});

app.get("/testgrade", async (req, res) => {
  try {
    const testgrades = await Test.find({});
    return res.status(200).json(testgrades);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/test/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTest = await Test.findByIdAndUpdate(id, req.body);

    if (!updatedTest) {
      return res.status(404).json({ message: "Test Not Found" });
    }

    return res.status(200).send({ message: "Test Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/test/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findById(id);

    return res.status(200).json(test);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/test/:id", async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Test removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

///////////////////////////////////notes api's///////////////////////////////////

app.post("/notes", async (req, res) => {
  try {
    if (
      !req.body.teacher_id ||
      !req.body.teacher_name ||
      !req.body.subject_name ||
      !req.body.heading ||
      !req.body.category ||
      !req.body.content
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newNotes = {
      teacher_id: req.body.teacher_id,
      teacher_name: req.body.teacher_name,
      subject_name: req.body.subject_name,
      heading: req.body.heading,
      category: req.body.category,
      content: req.body.content,
    };

    const Notess = await Notes.create(newNotes);
    return res.status(201).json(Notess);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/notes", async (req, res) => {
  try {
    const notes = await Notes.find({}).sort({ createdAt: -1 });
    return res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Notes.findById(id);

    return res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const note = await Notes.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Notes removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/notes/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedNotes = await Notes.findByIdAndUpdate(id, req.body);

    if (!updatedNotes) {
      return res.status(404).json({ message: "Notes Not Found" });
    }

    return res.status(200).send({ message: "Notes Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//////////////////////////////assignments api's////////////////////////////////

app.post("/assignments", async (req, res) => {
  try {
    if (
      !req.body.subject_name ||
      !req.body.teacher_name ||
      !req.body.teacher_id ||
      !req.body.topic ||
      !req.body.category ||
      req.body.questions.length === 0 ||
      req.body.answers.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAssignment = {
      subject_name: req.body.subject_name,
      teacher_name: req.body.teacher_name,
      teacher_id: req.body.teacher_id,
      topic: req.body.topic,
      category: req.body.category,
      questions: req.body.questions,
      answers: req.body.answers,
    };

    const assignment = await Assignment.create(newAssignment);
    return res.status(201).json(assignment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find({}).sort({ createdAt: -1 });
    return res.status(200).json(assignments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/assignments/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);

    return res.status(200).json(assignment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/assignments/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Notes removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/assignments/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAssignment = await Assignment.findByIdAndUpdate(id, req.body);

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment Not Found" });
    }

    return res.status(200).send({ message: "Assignment Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/////////////////////////////////attendance api's////////////////////////////

app.post("/attendance", async (req, res) => {
  try {
    if (
      !req.body.student_id ||
      !req.body.student_name ||
      !req.body.rollnumber ||
      !req.body.date ||
      !req.body.marking ||
      !req.body.student_email
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAttendance = {
      student_id: req.body.student_id,
      student_name: req.body.student_name,
      rollnumber: req.body.rollnumber,
      date: req.body.date,
      marking: req.body.marking,
      student_email: req.body.student_email,
    };

    const attendance = await Attendance.create(newAttendance);
    return res.status(201).json(attendance);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find({});
    return res.status(200).json(attendance);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("App is connected to MongoDB");
    app.listen(PORT, () => {
      console.log("App is running on port " + PORT + "...");
    });
  })
  .catch((err) => {
    console.log(err);
  });
