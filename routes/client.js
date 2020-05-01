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
//,auth("CLIENT_ADMIN")
router.delete("/terminal/:terminalId", async(req,res)=>{
    return await deleteTerminal(req, res)
})


module.exports = router