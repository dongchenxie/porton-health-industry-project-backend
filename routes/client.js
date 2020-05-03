const router = require("express").Router()
const { auth } = require("./verifyToken")
const { getAppointmentById, updateAppointmentById, getAppointments, getVerificationContent, getTerminalById } = require("../controller/clientController")

// Get Client/Appointment/{id}
router.get("/appointment/:appointmentId", async (req, res) => {
    return await getAppointmentById(req, res)
})

// Put Client/Appointment/{id}
router.put("/appointment/:appointmentId", async (req, res) => {
    return await updateAppointmentById(req, res)
})

// Get Client/Appointments
router.get("/appointments", auth("CLIENT_ADMIN"), async (req, res) => {
    return await getAppointments(req, res)
})

// Get Client/terminal/verificationcontent
router.get("/terminal/verificationContent/:terminalId", 
// auth("CLIENT_ADMIN"),
 async (req, res) => {
    return await getVerificationContent(req, res)
})

// Get Client/terminal/{id}
router.get("/terminal/:terminalId", 
// auth("CLIENT_ADMIN"),
 async (req, res) => {
    return await getTerminalById(req, res)
})


module.exports = router