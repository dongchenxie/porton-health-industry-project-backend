const router = require("express").Router()
const { getAppointmentById } = require("../controller/clientController")

// Get Client/Appointment/{id}
router.get("/appointment/:appointmentId", async (req, res) => {
    return await getAppointmentById(req, res)
})

module.exports = router