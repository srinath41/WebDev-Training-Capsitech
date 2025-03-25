const Project = require("../models/projectModel");

// Create a new project (Admin only)
const createProject = async (req, res) => {
    const { title, description, category } = req.body;

    try {
        const project = await Project.create({
            title,
            description,
            category,
            createdBy: req.user._id,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("createdBy", "name email");
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single project
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("createdBy", "name email");

        if (!project) return res.status(404).json({ message: "Project not found" });

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update a project (Admin only)
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ message: "Project not found" });

        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.category = req.body.category || project.category;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a project (Admin only)
const deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };
