import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  course: String,
});

export default mongoose.model("Student", StudentSchema);
