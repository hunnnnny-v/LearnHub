import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },

    task_name: {
      type: String,
      required: true,
    },

    task_date: {
      type: String,
      required: true,
    },

    task_category: {
      type: String,
    },

    task_completed: {
      type: Boolean,
    },

    task_completed_on: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
