const Appointment = require('../model/Appointment')

const getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params
    try {
        const appointment = await Appointment.findById(appointmentId).select("-__v")
        return res.status(200).send(appointment)
    } catch (err) {
        return res.status(400).send({ error: "Invalid appointment ID." })
    }
}

module.exports.getAppointmentById = getAppointmentById