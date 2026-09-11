const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const BlacklistModel = require("../models/blacklist.model");
const captainModel = require("../models/captain.model");

async function LoginValidation(req, res, next) {
    // ✅ strip "Bearer " right here, use let
    let token =
        req.cookies?.UserAccess_Token ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const checkBlacklist = await BlacklistModel.findOne({ token });
        if (checkBlacklist) {
            return res.status(401).json({ message: "Session expired. Please login again" });
        }

        const decoder = jwt.verify(token, process.env.JWT_SECRET);
        const userData = await userModel.findById(decoder.id || decoder._id);

        if (!userData) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = userData;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Conflicts in Token" });
    }
}

async function CaptainLoginValidation(req, res, next) {
    let token =
        req.cookies?.CaptainAccess_Token ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access" });
    }

    try {
        const blacklisted = await BlacklistModel.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoder = jwt.verify(token, process.env.JWT_SECRET);
        const Captain = await captainModel.findById(decoder.id || decoder._id);

        if (!Captain) {
            return res.status(401).json({ message: "Captain Not found" });
        }

        req.user = Captain;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Token Compromised" });
    }
}

module.exports = { LoginValidation, CaptainLoginValidation };