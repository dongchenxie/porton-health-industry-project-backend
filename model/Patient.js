const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({
    lastName: {
        type: String
    },
    firstName: {
        type: String
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER']
    },
    careCardNumber: {
        type: String
    },
    mrp: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    comment: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
})

module.exports = mongoose.model("Patient", patientSchema)