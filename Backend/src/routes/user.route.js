const express=require("express")
const { body } = require("express-validator")
const authMiddleware=require("../middlewares/auth.middleware")
const RegisterUser=require("../controllers/user.controller")





const router=express.Router()



router.post("/register", [
    body("email").isEmail().withMessage("Enter a valid Email"),
    body("fullname.firstname").isLength({ min: 3 })
        .withMessage("Firstname should be at least 3 characters long"),
    body("mobileNumber").isLength({ min: 10, max: 10 })
        .withMessage("Mobile number must be exactly 10 digits"),
    body("password").isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long")
], RegisterUser.registerUser);

router.post("/login",[
    body("email").isEmail().withMessage("Enter a valid Email"),
    body("password")
        .exists().withMessage("Password field is missing entirely")
        .isLength({ min: 6 }).withMessage("Password should be 6 characters long")
],RegisterUser.loginuser)

router.get("/user-profile", authMiddleware.LoginValidation,RegisterUser.userProfile )

router.get("/logout", authMiddleware.LoginValidation,RegisterUser.logoutuser)


module.exports=router