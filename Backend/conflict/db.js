
const mongoose = require("mongoose")

module.exports = () => {
    mongoose.connect("process.env.DBURL").
    then(() => {console.log("Database connected") }).
    catch((err) => {console.log(err)})
}