const express=require("express")
const CaptainAuthentication=require("../middlewares/auth.middleware")
const CaptainController=require("../controllers/captain.controller")

const route=express.Router()


route.post("/register-captain",CaptainController.registernewCaptain)

route.post("/login-captain",CaptainController.login)

route.get("/captain-profile",CaptainAuthentication.CaptainLoginValidation, CaptainController.captainprofile)

route.get("/logout-captain",CaptainAuthentication.CaptainLoginValidation, CaptainController.captainlogout)
module.exports=route