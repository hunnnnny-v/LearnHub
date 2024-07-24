import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema(
  {
    student_id: {
      type: String,
      required: true,
    },
    student_name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    rollnumber: {
      type: String,
      required: true,
    },
    marking: {
      type: String,
      required: true,
    },
    student_email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
