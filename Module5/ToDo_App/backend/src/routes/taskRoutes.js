const express = require("express");
const {
    createTask,
    getTasksByProject,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
} = require("../controllers/taskController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, isAdmin, createTask);  // Create task (Admin)
router.get("/project/:projectId", getTasksByProject);  // Get tasks for a project
router.get("/:id", getTaskById);  // Get task by ID
router.put("/:id", protect, isAdmin, updateTask);  // Update task (Admin)
router.delete("/:id", protect, isAdmin, deleteTask);  // Delete task (Admin)
router.put("/:id/status", protect, updateTaskStatus);  // Update task status (Assigned user)

module.exports = router;
