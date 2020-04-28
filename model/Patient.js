const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({
    lastName: {
        type: String
    },
    firstName: {
        type: String
    },
    age: {
        type: Number,
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
    phoneNumber: {
        type: String
    },
    comment: {
        type: String
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
})

module.exports = mongoose.model("Patient", patientSchema)