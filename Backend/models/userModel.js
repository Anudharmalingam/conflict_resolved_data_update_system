const mongoose =  require("mongoose")

const UserSchema = mongoose.Schema({ // schema is for model creation alone
   name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

})

const User = mongoose.model("User", UserSchema)

module.exports = User