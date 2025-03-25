const express = require("express");
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require("../controllers/projectController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, isAdmin, createProject);  // Create project (Admin)
router.get("/", getProjects);  // Get all projects
router.get("/:id", getProjectById);  // Get project by ID
router.put("/:id", protect, isAdmin, updateProject);  // Update project (Admin)
router.delete("/:id", protect, isAdmin, deleteProject);  // Delete project (Admin)

module.exports = router;
