const mongoose = require("mongoose")



const userSchema = new mongoose.Schema({
    firstName: {// need to split to first name and last name
        type: String,
        require: true,
        min: 1,
        max: 255
    },
    lastName: {
        type: String,
        require: true,
        min: 1,
        max: 255
    },
    email: {
        type: String,
        require: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    date: {
        type: Date,
        default: Date.now()
    },
    role:{//SYSTEM_ADMIN CLIENT_ADMIN
        type:String,
        enum:["SYSTEM_ADMIN", "CLIENT_ADMIN"]      
    },
    isEnabled: {
        type: Boolean,
        default: true
    }
})
module.exports = mongoose.model("User", userSchema)