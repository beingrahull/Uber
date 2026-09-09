const mongoose = require("mongoose");

async function connectdb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection has been established to the database");
    } catch (error) {
        console.log("Database connection error:", error);
    }
}

module.exports = connectdb;
