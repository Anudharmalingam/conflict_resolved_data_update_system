const mongoose = require("mongoose")

module.exports = () => {
    mongoose.connect("mongodb://localhost:27017/conflict-data-sys").
    then(() => {console.log("Database connected") }).
    catch((err) => {console.log(err)})
}