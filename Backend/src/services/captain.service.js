const captainModel=require("../models/captain.model")

async function createCaptain({ firstname, lastname, email, mobileNo, password, plate, colour, model, vehicleType, capacity }) {

    if (!firstname || !email || !mobileNo || !password || !plate || !model || !vehicleType) {
        throw new Error("All mandatory fields must be provided.");
    }

    const existingCaptain = await captainModel.findOne({
        $or: [
            { email: email.toLowerCase() },
            { mobileNo: mobileNo },
            { plate: plate }
        ]
    })


    if (existingCaptain) {

        if (existingCaptain.email === email.toLowerCase()) throw new Error("Email is already registered.");
        if (existingCaptain.mobileNo === mobileNo) throw new Error("Mobile number is already registered.");
        if (existingCaptain.plate === plate) throw new Error("Vehicle registration plate is already registered.");
    }

    const hashpassword = await captainModel.Hashpassword(password)

    const newCaptain = await captainModel.create({
        fullname: { firstname, lastname },
        email,
        mobileNo,
        password: hashpassword,
        plate,
        colour,
        model,
        vehicleType,
        capacity
    })

    return newCaptain

}

module.exports = {createCaptain}