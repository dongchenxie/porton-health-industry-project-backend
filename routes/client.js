const router = require("express").Router()
const { auth } = require("./verifyToken")
const { getAppointmentById, updateAppointmentById, getAppointments } = require("../controller/clientController")

// Get Client/Appointment/{id}
router.get("/appointment/:appointmentId", async (req, res) => {
    return await getAppointmentById(req, res)
})

// Put Client/Appointment/{id}
router.put("/appointment/:appointmentId", async (req, res) => {
    return await updateAppointmentById(req, res)
})

// Get Client/Appointments
router.get("/appointments", async (req, res) => {
    return await getAppointments(req, res)
})

module.exports = router