const Terminal = require('../model/Terminal')
const Appointment = require("../model/Appointment")
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const { token } = req.body
    let terminal = {}
    try {
        terminal = await Terminal.findOne({ token: token })
        if (terminal) {
            if (terminal.status == 'DELETED') {
                return res.status(401).send({ error: "This terminal has been deleted." })
            } else if (terminal.status == 'DISABLED') {
                return res.status(400).send({ error: "This terminal has been disabled." })
            }
        }
    } catch (err) {
        return res.status(401).send({ error: "Invalid terminal token." })
    }
    // Create token
    const hashedToken = jwt.sign({ _id: terminal.id }, process.env.TOKEN_SECRET)
    return res.status(200).send({ token: hashedToken })
}

const getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;
    try {
        const appointment = await Appointment.findById(appointmentId).select(
            "-__v"
        );
        return res.status(200).send(appointment);
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Invalid appointment ID." });
    }
};

module.exports.login = login
module.exports.getAppointmentById = getAppointmentById