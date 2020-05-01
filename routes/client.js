const router = require("express").Router()
const { getAppointmentById, deleteTerminal, getTerminalById } = require("../controller/clientController")

// Get Client/Appointment/{id}
router.get("/appointment/:appointmentId", async (req, res) => {
    return await getAppointmentById(req, res)
})

// Get Client/Terminal/{id}
router.get("/termianl/:terminalId", async (req, res) => {
    return await getTerminalById(req, res)
})

// Delete Client/Terminal/{id}
router.delete("/terminal/:terminalId",(req,res)=>{
    return await deleteTerminal(req, res)
})


module.exports = router