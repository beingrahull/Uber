const userModel=require("../models/user.model")
const RegistrationService=require("../services/user.service")
const {validationResult} = require("express-validator")
const jwt=require("jsonwebtoken")
const BlacklistModel=require("../models/blacklist.model")




async function registerUser(req,res) {
    
    try{
        const errors=validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {fullname,password,email,mobileNumber} = req.body
        
        const UserAlreadyPresent=await userModel.findOne({
            $or:
            [{email},
            {mobileNumber}]
        })
        
        if (UserAlreadyPresent){
            return res.status(400).json({message:"User Exists"})
        }

        const EncryptedPassword = await userModel.hashPassword(password)

        const newUser=await RegistrationService.CreateAccount({
            Firstname:fullname.firstname,
            Lastname:fullname.lastname,
            Email:email,
            Contact_Number: mobileNumber,
            Password:EncryptedPassword
        })

        
        const token=await newUser.generatetoken()



        return res.status(201).json({
            message: "User Registration Successful to the Database",
            token: token,
            userRecord: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                mobileNumber: newUser.mobileNumber
            }
        })
    }catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
    
}


async function loginuser(req,res){

    const {email,password}=req.body

    const isMatch=await userModel.findOne({email}).select("+password")
    if (!isMatch){
        return res.status(401).json({message:"Invalid Email or Password"})
    }

    const PasswordValidation= await isMatch.comparepassword(password)

    if (!PasswordValidation) {
        return res.status(401).json({message:"Invalid Password"})
    }

    const token=await jwt.sign({id:isMatch._id},process.env.JWT_SECRET)

    res.cookie("Access_Token",token)

    return res.status(201).json({message:"Login Successful"})

}


async function userProfile(req,res) {
    const userData = req.user
    if (!userData) {
        return res.status(401).json({message:"Profile cannot be fetched"})
    }
    return res.status(201).json({message:"Profile fetching successful",
        userProfile:userData
    })
}

async function logoutuser(req,res) {
    res.clearCookie("Access_Token")
    const logout_token = req.cookies.Access_Token || req.headers.authorization?.split(" ") [ 1 ]
    const logout_data= await BlacklistModel.create({token:logout_token})
    return res.status(201).json({message:"Logged out"}) 
}

module.exports={registerUser , loginuser, userProfile, logoutuser}