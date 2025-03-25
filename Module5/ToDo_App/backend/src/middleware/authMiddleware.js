const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized, admin only" });
    }
};

module.exports = { protect, isAdmin };
