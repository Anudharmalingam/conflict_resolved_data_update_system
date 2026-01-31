/*npm i bcrypt - for installing password

token authentication, section authentication - storing a section token in a database,for example netflix anol we have device limits
 jwt authention -> it doesnt store auth, for example google u can login wherever and there is no device limit
 npm install jsonwebtoken

*/
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

const secretCode = "af#@jrfpogyugf&Ubk"

mongoose.connect("mongodb://localhost:27017/test-rms-db").
then(() => {console.log("Database connected") }).
catch((err) => {console.log(err)})


// schema creation - blueprint
const UserSchema = mongoose.Schema({
    name:String,
    email:String,
    role:String,  
    age:Number,
    password:String
})

const requestSchema = new mongoose.Schema({
    title:String,
    dicription:String,
    status:String,
    requestedOn: {
        type :Date,
        default : Date.now 
    },
    actionTakenOn:Date,
    // who requested ? // employee, all employee, manager - will be stored in user , it should not be name , or emailid, bcz it may change everytime so only constant is objid
    requestedBy: {
        type : mongoose.Schema.Types.ObjectId,// objectid - for each person they have unique id 
        ref:"User"
    },
    // manger for eg
     requestedTo: {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
})
const User = mongoose.model("User", UserSchema)
const Request = mongoose.model("Request",requestSchema)

app.post('/change-request/create', async(req,res) =>{ // first ask for token
    const authorization = req.headers.authorization;  // headers la it contains the authorization (it is a property)
    if (!authorization){
        return res.json({"message":"Authorization missing"}) //if autho is not in header- get out 
    }
    try{
        /*
        console.log(authorization)
        return res.json({"message": "valid"})
        */
    
       const token = authorization.split(" ")[1]
       const decode = jwt.verify(token,secretCode)
       console.log(decode)

       const title = req.body.title;
       const description = req.body.description
       const requestedTo = req.body.requestedTo

       if (!title || !description || !requestedTo){
        return res.json({"message":"please send the details"})
       }

       const request = Request({
        title:title,
        description:description,
        status:"PENDING",
        requestedBy:decode.user,
        requestedTo: requestedTo
        
       });

       await request.save()

       return res.json({"message":"request Created"})

       return res.json({"message":"valid"})

    }catch(err){
        console.log(err)
        return res.json({"message": "Token is invalid"})
    }

})
// User creation endpoint
app.post('/users/signup', async(req, res) => {
 // check if req.body exists
 if(!req.body){
    return res.json({"message":"Request body required"})
 }
    const name = req.body.name
    const email = req.body.email
    const role = req.body.role
    const age = req.body.age
    const password = req.body.password

    console.log("name:",name)
    //check all required field
    if(!email|| !password|| !role || !name || !age){
        return res.json({"message":"All fields are required: name,email,role,age,password"})
    }
    //check if role is captial letter
    if(role !== role.toUpperCase()){
        return res.json({"message":"Role must be in captial letter"})
    }
    
    if(!email || !password){
       return res.json({"message":"invalid request"})
    }

    if(password.length < 8){
        return res.json({"message":"Password must be at least 8 characters long"})
    }

    const userCheck = await User.findOne({email:email})// to find only one  we use find one, if many find ()
    console.log("userCheck:" ,userCheck)

    if (userCheck){
        return res.json({"message":"mail exist already "})

    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
   
    // model 
    const user = new User({
        name : name,
        email : email,
        password : hashedPassword
    })
     // save to database
    await user.save() //wait till it get the proper response
    // if u use await u must use async , this condition they have given 

    res.json({"message": "Succesfully"})
})

function auth(req,res,next){
    const authorization = req.headers.authorization;  // headers la it contains the authorization (it is a property)
    if (!authorization){
        return res.json({"message":"Authorization missing"}) //if autho is not in header- get out 
    }
    try{
        /*
        console.log(authorization)
        return res.json({"message": "valid"})
        */
    
       const token = authorization.split(" ")[1]
       const decode = jwt.verify(token,secretCode)
       console.log(decode)

       const title = req.body.title;
       const description = req.body.description
       const requestedTo = req.body.requestedTo

       if (!title || !description || !requestedTo){
        return res.json({"message":"please send the details"})
       }

       const request = Request({
        title:title,
        description:description,
        status:"PENDING",
        requestedBy:decode.user,
        requestedTo: requestedTo
        
       });

       await request.save()

       return res.json({"message":"request Created"})

       return res.json({"message":"valid"})

    }catch(err){
        console.log(err)
        return res.json({"message": "Token is invalid"})
    }

}

app.post("/users/login",async(req,res)=>{
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
            secretCode,
            {expiresIn : "1h"}
        )
        return res.json({message : "Login successfull", token: token})
    }  
    catch (err){
        console.log(err)
        return res.json({message : "server error"})
    }
})


app.listen(3000)