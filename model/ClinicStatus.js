const mongoose = require("mongoose")

const clinicStatusSchema = new mongoose.Schema({
    isCheckInEnbled: {
        type: Boolean
    }
})

module.exports = mongoose.model("ClinicStatus", clinicStatusSchema)