require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel");


router.post("/signup", async (req, res) => {
  try {
    const name = req.body.name
    const email = req.body.email
    const role = req.body.role
    const password = req.body.password


    if (!name || !email || !password || !role) {
      return res.json({
        message: "All fields are required: name, email, password, role"
      });
    }


    if (!["user", "admin"].includes(role)) {
      return res.json({
        message: "Role must be user or admin"
      });
    }


    if (password.length < 8) {
      return res.json({
        message: "Password must be at least 8 characters long"
      });
    }

    const userCheck = await User.findOne({ email });
    if (userCheck) {
      return res.json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.json({
      message: "Server error"
    });
  }
});


router.post("/users/login",async(req,res)=>{
        const user = await User.findOne({email : req.body.email})
        if(!user){
            return res.json({message:"Email invalid"})
        }
        const isPasswordMatching = await bcrypt.compare(
            req.body.password,user.password)
        if(!isPasswordMatching) {
            return res.json({"message":"password invalid"})
        }
       
        try{
        const token = jwt.sign(
            {user : user._id},
            process.env.SECRETCODE,
            {expiresIn : "1h"}
        )
        return res.json({message : "Login successfull", token: token})
    }  
    catch (err){
        console.log(err)
        return res.json({message : "server error"})
    }
})


module.exports = router;
