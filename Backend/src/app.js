const express=require("express")
const cors=require("cors")
const cookieParser=require("cookie-parser")

const router=require("./routes/user.route")


const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())



app.use("/api/user", router)


module.exports=app