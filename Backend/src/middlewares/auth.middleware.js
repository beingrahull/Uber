const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const BlacklistModel=require("../models/blacklist.model")
const captainModel=require("../models/captain.model")

async function LoginValidation(req,res,next) {
    const token = req.cookies.UserAccess_Token || req.header('Authorization')
    if (!token) {
        return res.status(400).json({message:"Unauthorized access"})
    }

    

    try{
        if (token.startsWith("Bearer ")) {
            token = token.replace("Bearer ", "");
        }


        const checkBlacklist = await BlacklistModel.findOne({token:token})

        if (checkBlacklist) {
            return res.status(401).json({message:"Session expired. Please login again"})
        }
        const decoder =  jwt.verify(token,process.env.JWT_SECRET)

        const userData = await userModel.findById(decoder.id || decoder._id)

        req.user = userData

        next()

    }catch(error){
        return res.status(401).json({message:"Conflicts in Token"})
    }
}


async function CaptainLoginValidation(req,res,next) {
    const token = req.cookies.CaptainAccess_Token || req.header.Authorization?.split(" ")
    if (!token) {
        return res.status(401).json({message:"Unauthorized Access"})
    }

    const blacklisted = await BlacklistModel.findOne({token:token})

    if (blacklisted) {
        return res.status(401).json({message:"Unauthorized"})
    }

    try{
        const decoder = jwt.verify(token,process.env.JWT_SECRET)
        const Captain= await captainModel.findOne({_id:decoder.id})
        req.user = Captain
        next()
    }catch(error){
        return res.status(401).json({message:"Token Compromised"})
    }
}

module.exports={LoginValidation, CaptainLoginValidation}