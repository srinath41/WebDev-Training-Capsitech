const express = require("express");
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} = require("../controllers/taskController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks for a project
router.get("/:projectId", protect, getTasks);

// ✅ Ensure this route is correctly defined  
router.post("/:projectId", protect, isAdmin, createTask);

// Update a task (Assigned users & Admin can update)
router.put("/:taskId", protect, updateTask);

// Delete a task (Admin only, soft delete)
router.delete("/:taskId", protect, isAdmin, deleteTask);

module.exports = router;
