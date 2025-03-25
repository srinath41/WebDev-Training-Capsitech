const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

// Create a new task (Admin only)
const createTask = async (req, res) => {
    const { title, description, project, assignedTo, startDate, endDate } = req.body;

    try {
        const existingProject = await Project.findById(project);
        if (!existingProject) return res.status(404).json({ message: "Project not found" });

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            startDate,
            endDate,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all tasks for a project
const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate("assignedTo", "name email")
            .populate("project", "title");

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single task
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("project", "title");

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update a task (Admin only)
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a task (Admin only)
const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Users can update task status
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        task.status = req.body.status || task.status;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createTask, getTasksByProject, getTaskById, updateTask, deleteTask, updateTaskStatus };
