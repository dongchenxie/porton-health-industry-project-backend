const mongoose = require("mongoose")

const verificationContentSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    phoneNumber: {
        type: String,
    },
    careCardNumber: {
        type: String,
    },
    phoneNumberLast4: {
        type: String
    },
    careCardLast4: {
        type: String
    }
})

module.exports = mongoose.model("VerificationContent", verificationContentSchema)