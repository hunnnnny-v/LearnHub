import mongoose from "mongoose";

const testSchema = mongoose.Schema(
  {
    subject_name: {
      type: String,
      required: true,
    },

    test_name: {
      type: String,
      required: true,
    },

    subject_id: {
      type: String,
      required: true,
    },

    student_name: {
      type: String,
      required: true,
    },

    student_id: {
      type: String,
      required: true,
    },

    teacher_id: {
      type: String,
      required: true,
    },

    grade: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Test = mongoose.model("Test", testSchema);
