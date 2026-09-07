const express=require("express")
const cors=require("cors")
const cookieParser=require("cookie-parser")

const userrouter=require("./routes/user.route")
const captainroute=require("./routes/captain.route")


const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())



app.use("/api/user", userrouter)
app.use("/api/captain",captainroute)


module.exports=app