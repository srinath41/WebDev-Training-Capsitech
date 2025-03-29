const express = require("express");
const { 
    createProject, 
    getProjects, 
    getProjectById, 
    getProjectUsers,
    updateProject, 
    deleteProject 
} = require("../controllers/projectController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, isAdmin, createProject);  // Create project (Admin)
router.get("/", protect, getProjects);  // Get all projects (Only authenticated users)
router.get("/:id", protect, getProjectById);  // Get project by ID
router.put("/:id", protect, isAdmin, updateProject);  // Update project (Admin or Project Creator)
router.delete("/:id", protect, isAdmin, deleteProject);  // Delete project (Admin)
router.get("/:id/users", protect, isAdmin, getProjectUsers);

module.exports = router;
