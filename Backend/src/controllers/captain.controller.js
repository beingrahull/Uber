const captainModel = require("../models/captain.model");
const newCaptainService = require("../services/captain.service");
const blacklistModel = require("../models/blacklist.model");
const { validationResult } = require("express-validator");

async function registernewCaptain(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            fullname,
            password,
            mobileNo,
            plate,
            colour,
            model,
            vehicleType,
            capacity
        } = req.body;

        const email = (req.body.email || "").trim().toLowerCase();

        const useralreadyregistered = await captainModel.findOne({
            $or: [{ email }, { mobileNo }]
        });

        if (useralreadyregistered) {
            return res.status(400).json({ message: "Captain already exists" });
        }

        const EncryptedPassword = await captainModel.Hashpassword(password);

        const newCaptain = await newCaptainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            mobileNo,
            password: EncryptedPassword,
            plate,
            colour,
            model,
            vehicleType,
            capacity
        });

        // ✅ 1. Sign a JWT
        const token = newCaptain.generatetoken();

        // ✅ 2. Set the cookie
        res.cookie("CaptainAccess_Token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // ✅ 3. Strip hashed password before responding
        const captain = newCaptain.toObject();
        delete captain.password;

        // ✅ 4. Return the token + captain to the frontend
        return res.status(201).json({
            message: "Captain Registered",
            token,
            captain
        });
    } catch (error) {
        console.error("Captain Registration Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function login(req, res) {
    try {
        const email = (req.body.email || "").trim().toLowerCase();
        const { password } = req.body;

        const emailinDB = await captainModel
            .findOne({ email })
            .select("+password");

        if (!emailinDB) {
            return res.status(401).json({ message: "Captain needs to register first" });
        }

        const Validatepassword = await emailinDB.ComparePassword(password);
        if (!Validatepassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = emailinDB.generatetoken();

        res.cookie("CaptainAccess_Token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const captain = emailinDB.toObject();
        delete captain.password;

        // ✅ token is now included
        return res.status(200).json({
            message: "Access Granted",
            token,
            captain
        });
    } catch (error) {
        console.error("Captain Login Error:", error);
        return res.status(500).json({ message: "Cannot Login. Try Again" });
    }
}

async function captainprofile(req, res) {
    const captainData = req.user;

    if (!captainData) {
        return res.status(401).json({ message: "Failed to fetch profile" });
    }

    // ✅ key renamed from "Profile" to "captain"
    return res.status(200).json({
        message: "Profile Fetched",
        captain: captainData
    });
}

async function captainlogout(req, res) {
    try {
        const token =
            req.cookies?.CaptainAccess_Token ||
            req.headers?.authorization?.split(" ")[1];

        if (token) {
            await blacklistModel.create({ token });
        }

        res.clearCookie("CaptainAccess_Token", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({ Status: "Logout Successful" });
    } catch (error) {
        console.error("Captain Logout Error:", error);
        return res.status(500).json({ message: "Logout failed" });
    }
}

module.exports = {
    registernewCaptain,
    login,
    captainprofile,
    captainlogout
};