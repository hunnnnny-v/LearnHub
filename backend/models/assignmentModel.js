import mongoose from "mongoose";

const assignmentSchema = mongoose.Schema(
  {
    subject_name: {
      type: String,
      required: true,
    },

    teacher_name: {
      type: String,
      required: true,
    },

    teacher_id: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    questions: {
      type: Array,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
