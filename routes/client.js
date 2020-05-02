const router = require("express").Router()
const { getAppointmentById, deleteTerminal, getTerminalById } = require("../controller/clientController")
// const {auth} = require("./verifyToken")


// Get Client/Appointment/{id}
router.get("/appointment/:appointmentId", async (req, res) => {
    return await getAppointmentById(req, res)
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
router.post("/terminal", async(req,res)=>{
    return await postTerminal(req, res)
})

module.exports = router