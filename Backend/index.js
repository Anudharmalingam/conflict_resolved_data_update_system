require("dotenv").config();
const express = require("express")
const connectDB = require("./conflict/db") // within this folder
const userApi = require("./api/userapi")
const requestApi = require()
const app = express()
app.use(express.json())

connectDB()

app.use("/users",userApi)
app.use("/requests",requestApi)

app.get("/", (req, res) => {
  res.send("Conflict Resolved Data Update System API is running");
});

//process.env.PORT (30000) npm i dotenv
app.listen(process.env.PORT, () =>{
    console.log("server is running on ", process.env.PORT)
})

