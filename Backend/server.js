// Replace require("dotenv").config() with this:
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const http=require("http")
const app=require("./src/app")
const connectDB=require("./src/db/db")


const PORT=process.env.PORT || 5000

connectDB()

const server=http.createServer(app)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});