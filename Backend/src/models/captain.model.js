const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const CaptainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:[true,"Name is a required field"],
            minlength:[3, "Firstname should be atleast 3 characters long"]
        },
        lastname:{
            type:String,
            default:"",
            minlength:[3, "Lastname should be atleast 3 characters long"]
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    mobileNo:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minlength:[8,"Password can't be less than 8 characters"],
        required:true,
        select:false
    },
    plate:{
        required:[true,"Car registration number required"],
        unique:true,
        type:String
    },
    colour:{
        type:String,
        minlength:[3, "Colour name should be atleast 3 characters long"]
    },
    model:{
        type:String,
        required:[true,"Car model is required"],
        minlength:[3, "Model name should be atleast 3 characters long"]
    },
    status:{
        type:String,
        enum:["ACTIVE","INACTIVE"],
        default:"INACTIVE"
    },
    capacity:{
        type:Number,
        min:[1, "Capacity should be atleast 1"]
    },
    vehicleType:{
        type:String,
        enum:["Cab","Motorcycle","Auto"]
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    }
})

CaptainSchema.methods.generatetoken = function() {
    const token =  jwt.sign({_id:this._id},process.env.JWT_SECRET)
    return token
}

CaptainSchema.methods.ComparePassword = async function(password) {
    const passwordValidation = await bcrypt.compare(password,this.password)
    return passwordValidation
}

CaptainSchema.statics.Hashpassword = async function(password) {
    const hashpassword = await bcrypt.hash(password,10)
    return hashpassword
}

const captainModel = mongoose.model("captain",CaptainSchema)

module.exports=captainModel