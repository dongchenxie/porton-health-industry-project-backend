const mongoose = require("mongoose")

const verificationContentSchema = new mongoose.Schema({
    firstName: {
        type: Boolean,
        default: false
    },
    lastName: {
        type: Boolean,
        default: true
    },
    phoneNumber: {
        type: Boolean,
        default: false
    },
    careCardNumber: {
        type: Boolean,
        default: false
    },
    phoneNumberLast4: {
        type: Boolean,
        default: false
    },
    careCardLast4: {
        type: Boolean,
        default: false
    },
    dateOfBirth: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("VerificationContent", verificationContentSchema)