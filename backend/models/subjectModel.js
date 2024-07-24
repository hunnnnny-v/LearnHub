import mongoose from "mongoose";

const subjectSchema = mongoose.Schema(
  {
    teacher_id: {
      type: String,
      required: true,
    },

    rollnumber: {
      type: String,
      required: true,
    },

    student_id: {
      type: String,
      required: true,
    },

    subject_name: {
      type: String,
      required: true,
    },

    grade: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);
