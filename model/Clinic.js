const mongoose = require("mongoose")

const clinicSchema = new mongoose.Schema({
    isCheckInEnbled: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        default: "New clinic"
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    terminals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Terminal'
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
})

module.exports = mongoose.model("Clinic", clinicSchema)