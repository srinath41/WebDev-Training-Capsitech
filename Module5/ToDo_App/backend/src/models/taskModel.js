const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending",
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
