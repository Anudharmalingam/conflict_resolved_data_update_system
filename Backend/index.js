const express = require("express")
const connectDB = require("./conflict/db") // within this folder
const userApi = require("./api/userapi")
const app = express()
app.use(express.json())

connectDB()

app.use("/users",userApi)

//process.env.PORT (30000) npm i dotenv
app.listen(process.env.PORT, () =>{
    console.log("server is running on ",process)
})