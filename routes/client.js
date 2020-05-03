const router = require("express").Router()

const { getAppointmentById, deleteTerminal, updateAppointmentById, getAppointments, getTerminals, getVerificationContent, getTerminalById } = require("../controller/clientController")

const { auth } = require("./verifyToken")

// Get Client/Appointment/{id}
router.get("/appointment/:appointmentId", async (req, res) => {
    return await getAppointmentById(req, res)
})


// Delete Client/Terminal/{id}
router.delete("/terminal/:terminalId", 
auth("CLIENT_ADMIN"),
async(req,res)=>{
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

// Get Client/terminal/verificationcontent
router.get("/terminal/verificationContent/:terminalId", 
auth("CLIENT_ADMIN"),
 async (req, res) => {
    return await getVerificationContent(req, res)
})

// Get Client/terminal/{id}
router.get("/terminal/:terminalId", 
// auth("CLIENT_ADMIN"),
 async (req, res) => {
    return await getTerminalById(req, res)
})

    // Get Client/Terminals
router.get("/terminals", auth("CLIENT_ADMIN"), async (req, res) => {
    return await getTerminals(req, res)
})


module.exports = router