const captainModel = require("../models/captain.model")
const newCaptainService = require("../services/captain.service")
const blacklistModel = require("../models/blacklist.model")
const {validationResult}=require("express-validator")

async function registernewCaptain(req,res) {
    const errors=validationResult(req)

    if (!errors.isEmpty()){
        return res.status(400).json({message:"Validation Failed for Registration Data"})
    }


    const {fullname, email, password, mobileNo, plate, colour, model, vehicleType, capacity}=req.body

    const useralreadyregistered = await captainModel.findOne({
        $or: [
        { email: email.toLowerCase() },
        { mobileNo: mobileNo }
    ]})

    if (useralreadyregistered) {
        return res.status(400).json({message:"User Exists"})
    }

    const newCaptain = await newCaptainService.createCaptain({

        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        mobileNo,
        password,
        plate,
        colour,
        model,
        vehicleType,
        capacity

    })

    return res.status(201).json({message:"Captain Registered",
        Captain:newCaptain
    })
}


async function login(req,res){

    try{
        const {email,password}=req.body

        const emailinDB = await captainModel.findOne({email:email}).select('+password')
        if (!emailinDB) {
            return res.status(401).json({message:"User needs to register first"})
        }

        const Validatepassword=await emailinDB.ComparePassword(password)
        if (!Validatepassword) {
            return res.status(401).json({message: "Invalid email or password"})
        }

        const token = await emailinDB.generatetoken()

        res.cookie("CaptainAccess_Token",token)

        return res.status(200).json({message:"Access Granted",
            captain:emailinDB
        })
    }catch(error){
        return res.status(401).json({message:"Cannot Login. Try Again"})
    }

}


async function captainprofile(req,res) {
    const captainData = req.user

    if (!captainData) {
        return res.status(401).json({Profile:"Failed to fetch. Try again"
        })
    }

    return res.status(201).json({message:"Profile Fetched",
        Profile: captainData
    })

}

async function captainlogout(req,res) {
    const token = req.cookies.CaptainAccess_Token || req.header.Authorization?.split(" ") [1]
    const logoutCaptain = await blacklistModel.create({token:token})
    
    res.clearCookie("CaptainAccess_Token")

    return res.status(201).json({Status:"Logout Successful"})
}

module.exports={registernewCaptain,login,captainprofile,captainlogout}