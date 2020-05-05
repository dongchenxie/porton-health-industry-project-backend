const router = require("express").Router()
const { terminalAuth } = require('./terminalToken')
const { login, getAppointmentById, getAppointments, checkIn } = require('../controller/terminalController')

// Post Terminal/Login
router.post("/login", async (req, res) => {
    return await login(req, res)
})

// Get Terminal/Appointment/{id}
router.get("/appointment/:appointmentId", terminalAuth, async (req, res) => {
    return await getAppointmentById(req, res)
})

// Get Terminal/Appointments
router.get("/appointments", terminalAuth, async (req, res) => {
    return await getAppointments(req, res)
})

// Post Terminal/Checkin
router.post("/checkin", terminalAuth, async (req, res) => {
    return await checkIn(req, res)
})
// Get Terminal/test
router.get("/test", terminalAuth, async (req, res) => {
    return res.status(200).send({ "details": req.terminal })
})

module.exports = router