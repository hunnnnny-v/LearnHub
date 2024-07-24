import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
  {
    teacher_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rollnumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    teacher_email: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
