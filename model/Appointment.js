const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    appointmentTime: {
        type: Date
    },
    doctorName: {
        type: String
    },
    reason: {
        type: String,
    },
    status: {
        type: String,
        enum:['NOT_SHOW', 'PENDING', 'CHECK_IN']
    },
    comment: {
        type: String
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
})

module.exports = mongoose.model("Appointment", appointmentSchema)