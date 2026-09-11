const userModel = require("../models/user.model");
const RegistrationService = require("../services/user.service");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const BlacklistModel = require("../models/blacklist.model");

async function registerUser(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            fullname,
            password,
            email: rawEmail,
            mobileNumber
        } = req.body;

        const email = (rawEmail || "").trim().toLowerCase();

        const UserAlreadyPresent = await userModel.findOne({
            $or: [{ email }, { mobileNumber }]
        });

        if (UserAlreadyPresent) {
            return res.status(400).json({ message: "User Exists" });
        }

        const EncryptedPassword = await userModel.hashPassword(password);

        const newUser = await RegistrationService.CreateAccount({
            Firstname: fullname.firstname,
            Lastname: fullname.lastname,
            Email: email,
            Contact_Number: mobileNumber,
            Password: EncryptedPassword
        });

        const token = newUser.generatetoken();

        return res.status(201).json({
            message: "User Registration Successful",
            token,
            userRecord: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                mobileNumber: newUser.mobileNumber
            }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function loginuser(req, res) {
    const email = (req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    const isMatch = await userModel.findOne({ email }).select("+password");
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const PasswordValidation = await isMatch.comparepassword(password);
    if (!PasswordValidation) {
        return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: isMatch._id }, process.env.JWT_SECRET);
    res.cookie("UserAccess_Token", token);

    return res.status(200).json({
        message: "Login Successful",
        token,
        user: {
            id: isMatch._id,
            fullname: isMatch.fullname,
            email: isMatch.email,
            mobileNumber: isMatch.mobileNumber
        }
    });
}

async function userProfile(req, res) {
    const userData = req.user;
    if (!userData) {
        return res.status(401).json({ message: "Profile cannot be fetched" });
    }
    return res.status(200).json({
        message: "Profile fetching successful",
        userProfile: userData
    });
}

async function logoutuser(req, res) {
    res.clearCookie("UserAccess_Token");
    const logout_token =
        req.cookies.UserAccess_Token ||
        req.headers.authorization?.split(" ")[1];

    await BlacklistModel.create({ token: logout_token });
    return res.status(200).json({ message: "Logged out" });
}

module.exports = { registerUser, loginuser, userProfile, logoutuser };