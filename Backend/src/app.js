const express=require("express")
const cors=require("cors")
const cookieParser=require("cookie-parser")

const userrouter=require("./routes/user.route")
const captainroute=require("./routes/captain.route")


const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(o => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);         // curl/Postman/server-to-server
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true
}));

app.use(cookieParser())



app.use("/api/user", userrouter)
app.use("/api/captain",captainroute)


module.exports=app