const router = require("express").Router()
const { getAppointmentById, deleteTerminal, getTerminalById, createTerminal, updateAppointmentById, getAppointments } = require("../controller/clientController")
const {auth} = require("./verifyToken")

// Put Client/Appointment/{id}
router.put("/appointment/:appointmentId", async (req, res) => {
    return await updateAppointmentById(req, res)
})

// Get Client/Appointments
router.get("/appointments", auth("CLIENT_ADMIN"), async (req, res) => {
    return await getAppointments(req, res)
})

// Get Client/Terminal/{id}
router.get("/terminal/:terminalId", async (req, res) => {
    return await getTerminalById(req, res)
})

// Delete Client/Terminal/{id}
router.delete("/terminal/:terminalId", async(req,res)=>{
    return await deleteTerminal(req, res)
})

// Post Client/Terminal
router.post("/terminal/:terminalName", async(req,res)=>{
    return await createTerminal(req, res)
})

module.exports = router
