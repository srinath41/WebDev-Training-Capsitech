const Project = require("../models/projectModel");
const mongoose = require("mongoose");

// Create a new project (Admin only)
const createProject = async (req, res) => {
    try {
      const { title, description, category, assignedUsers, startDate, endDate, projectStatus, isDelete} = req.body;
      const createdBy = req.user.id; // Assuming the user is authenticated
  
      console.log("Received Data:", req.body); // ✅ Debugging log
  
      const newProject = new Project({
        title,
        description,
        category,
        createdBy : req.user.id,
        assignedUsers: assignedUsers,
        startDate: startDate || new Date(),
        endDate,
        projectStatus: projectStatus || "Pending",
        isDelete: false,
      });
  
      const savedProject = await newProject.save();
      console.log("Saved Project:", savedProject); // ✅ Check if assignedUsers exists
  
      res.status(201).json(savedProject);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
// Get all projects (Include assigned users)
const getProjects = async (req, res) => { 
    try {
        // Get user role from request
        const userId = req.user?._id;
        const userRole = req.user?.role;  // Assuming role is stored in `req.user`
        console.log("User Info:", req.user);


        let projects;
        if (userRole === "admin") {
            // Admins can see all projects
            projects = await Project.find()
                .populate("createdBy", "name email")
                .populate("assignedUsers", "name email");
        } else {
            // Normal users should only see active projects (`isDelete: false`)
            projects = await Project.find({ isDelete: false, assignedUsers: userId })
                .populate("createdBy", "name email")
                .populate("assignedUsers", "name email");
        }

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get a single project (Include assigned users)
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("assignedUsers", "name email");

        if (!project) return res.status(404).json({ message: "Project not found" });

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getProjectUsers = async (req, res) => { 
    try {
        const { id } = req.params;

        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        const project = await Project.findById(id).populate("assignedUsers", "name email");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(project.assignedUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching project users", error: error.message });
    }
};

// Update a project (Only Admin or Project Creator)
const updateProject = async (req, res) => {
    try {
        const { title, description, category, assignedUsers, endDate, projectStatus, isDelete } = req.body;

        // Find the project
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // Update project fields
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            {
                title: title || project.title,
                description: description || project.description,
                category: category || project.category,
                assignedUsers: assignedUsers || project.assignedUsers,
                endDate: endDate || project.endDate,  // ✅ Ensure `endDate` updates
                projectStatus: projectStatus || project.projectStatus, // ✅ Ensure `projectStatus` updates
                isDelete: isDelete !== undefined ? isDelete : project.isDelete, // ✅ Ensure `isDelete` updates
            },
            { new: true } // ✅ Returns updated document
        );

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Delete a project (Admin only)
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ message: "Project not found" });

        await project.deleteOne();
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createProject, getProjects, getProjectById, getProjectUsers, updateProject, deleteProject };
