const router = require("express").Router()

const { getAppointmentById, deleteTerminal, getTerminalById, updateAppointmentById, getAppointments, getTerminals, updateTerminalById } = require("../controller/clientController")

const { auth } = require("./verifyToken")


// Get Client/Appointment/{id}
router.get("/appointment/:appointmentId", async (req, res) => {
    return await getAppointmentById(req, res)
})


// Get Client/Terminal/{id}
router.get("/terminal/:terminalId", async (req, res) => {
    return await getTerminalById(req, res)
})

// Delete Client/Terminal/{id}
//,auth("CLIENT_ADMIN")
router.delete("/terminal/:terminalId", async (req, res) => {
    return await deleteTerminal(req, res)
})


// Put Client/Appointment/{id}
router.put("/appointment/:appointmentId", async (req, res) => {
    return await updateAppointmentById(req, res)
})

// Get Client/Appointments
router.get("/appointments", auth("CLIENT_ADMIN"), async (req, res) => {
    return await getAppointments(req, res)
})

// Get Client/Terminals
router.get("/terminals", auth("CLIENT_ADMIN"), async (req, res) => {
    return await getTerminals(req, res)
})

// Put Client/Terminal/{id}
router.put("/terminal/:terminalId", async (req, res) => {
    return await updateTerminalById(req, res)
})

module.exports = router