const router = require("express").Router()
const { getAppointmentById, updateAppointmentById } = require("../controller/clientController")

// Get Client/Appointment/{id}
router.get("/appointment/:appointmentId", async (req, res) => {
    return await getAppointmentById(req, res)
})

router.put("/appointment/:appointmentId", async (req, res) => {
    return await updateAppointmentById(req, res)
})

module.exports = router