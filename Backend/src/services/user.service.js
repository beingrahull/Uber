const userModel = require("../models/user.model");

async function CreateAccount({
    Firstname,
    Lastname,
    Email,
    Contact_Number,
    Password
}) {
    if (!Firstname || !Email || !Contact_Number || !Password) {
        throw new Error("Required fields are missing");
    }

    const newUser = await userModel.create({
        fullname: {
            firstname: Firstname,
            lastname: Lastname || ""
        },
        email: Email,
        mobileNumber: Contact_Number,
        password: Password
    });

    return newUser;
}

module.exports = { CreateAccount };