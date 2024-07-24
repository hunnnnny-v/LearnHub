import mongoose from "mongoose";

const notesSchema = mongoose.Schema(
  {
    teacher_id: {
      type: String,
      required: true,
    },

    teacher_name: {
      type: String,
      required: true,
    },

    subject_name: {
      type: String,
      required: true,
    },

    heading: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Notes = mongoose.model("Notes", notesSchema);
