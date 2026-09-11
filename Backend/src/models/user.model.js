const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")

const userdata=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,"Firstname should be atleast 3 characters long"]
        },
        lastname: {
            type: String,
            default: "",
            validate: {
                validator: v => !v || v.length >= 3,
                message: "Lastname should be atleast 3 characters long"
            }
        }},
    password:{
        type:String,
        required:true,
        minlength:[6,"Password needs to be atleast 6 characters long"],
        select:false
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    mobileNumber:{
        type:String,
        unique:[true,"Mobile Number already present"],
        minlength:[10,"Mobile Number can't be less than 10 digits"]
    },
    socketId: {
        type: String,
    }

    })


userdata.methods.generatetoken= function() {
    const token =  jwt.sign({_id:this._id},process.env.JWT_SECRET)
    return token
}

userdata.methods.comparepassword=async function(password) {
    const passwordValidation=await bcrypt.compare(password,this.password)
    return passwordValidation
}

userdata.statics.hashPassword=async function (password) {
    const hashedPassword = await bcrypt.hash(password,10)
    return hashedPassword
}


const userModel=mongoose.model("user",userdata)



module.exports = userModel