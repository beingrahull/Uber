const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const BlacklistModel=require("../models/blacklist.model")

async function LoginValidation(req,res,next) {
    const token = req.cookies.Access_Token || req.header('Authorization')
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

module.exports={LoginValidation}