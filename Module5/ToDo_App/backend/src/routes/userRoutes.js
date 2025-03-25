const express = require("express");
const { registerUser, loginUser, getUsers, deleteUser } = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, isAdmin, getUsers);
router.delete("/:id", protect, isAdmin, deleteUser);

module.exports = router;
