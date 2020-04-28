const mongoose = require("mongoose")

const terminalSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "New terminal"
    },
    token: {
        type: String
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ['ENABLED', 'DISABLED', 'DELETED']
    },
    verificationContent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VerificationContent'
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    }
})

module.exports = mongoose.model("Terminal", terminalSchema)