const Terminal = require('../model/Terminal')
const Appointment = require("../model/Appointment")
const Patient = require('../model/Patient')
const jwt = require('jsonwebtoken')
const { getTerminalAppointmentsValidation, terminalCheckInValidation } = require('../component/validation')

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
        const appointment = await Appointment
            .findById(appointmentId)
            .populate("patient", "-appointments -__v")
            .select("-__v")
        return res.status(200).send(appointment);
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Invalid appointment ID." })
    }
};

const getAppointments = async (req, res) => {
    const { error } = getTerminalAppointmentsValidation(req.query)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const { page = 1, perPage = 10, min_ahead = 15 } = req.query
    const _page = Number(page)
    const _perPage = Number(perPage)
    const currentTime = Date.now()
    let appointmentTime = new Date(currentTime)
    appointmentTime.setMinutes(appointmentTime.getMinutes() + min_ahead)

    try {
        const terminal = await Terminal.findById(req.terminal._id)
        let appointments = await Appointment.aggregate([
            {
                $lookup: {
                    from: Patient.collection.name,
                    localField: "patient",
                    foreignField: "_id",
                    as: "patient"
                }
            },
            {
                $match: {
                    clinic: terminal.clinic,
                    appointmentTime: { $gte: currentTime, $lte: appointmentTime },
                    status: "PENDING"
                }
            },
            {
                $facet: {
                    metadata: [
                        { $count: "totalResults" }
                    ],
                    data: [
                        { $sort: { "appointmentTime": 1 } },
                        { $skip: (_page - 1) * _perPage },
                        { $limit: _perPage },
                        { $project: { __v: 0, "patient.__v": 0, "patient.appointments": 0 } }
                    ]
                }
            }
        ])

        appointments = appointments[0];
        const total = appointments.metadata[0]
            ? appointments.metadata[0].totalResults
            : 0
        appointments.metadata = {
            currentPage: _page,
            perPage: _perPage,
            totalResults: total,
            totalPages: Math.ceil(total / _perPage),
            nextPage: _page + 1 > Math.ceil(total / _perPage) ? null : _page + 1,
            prevPage: _page - 1 <= 0 ? null : _page - 1
        }
        return res.status(200).send(appointments)
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Failed to get appointments." })
    }
}

const checkIn = async (req, res) => {
    const { appointmentId, content } = req.body
    const _content = JSON.parse(content)
    let appointment = {}
    let terminal = {}
    try {
        appointment = await Appointment
            .findById(appointmentId)
            .populate('patient', '-__v -appointments')
            .select('-__v')
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Invalid appointment ID." })
    }

    try {
        terminal = await Terminal
            .findById(req.terminal._id)
            .populate('verificationContent')
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Invalid terminal ID." })
    }

    const { error } = terminalCheckInValidation(_content, terminal.verificationContent)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    for (let key in terminal.verificationContent) {
        if (terminal.verificationContent[key] == true) {
            if (_content[key] && _content[key].toString().toUpperCase() != appointment.patient[key].toString().toUpperCase()) {
                return res.status(400).send({ error: "Check-in information is not correct." })
            }
        }
    }

    try {
        appointment.status = "CHECK_IN"
        await appointment.save()
        return res.status(200).send(appointment)
    } catch (err) {
        return res.status(400).send({ error: "Faild to check in." })
    }
}

module.exports.login = login
module.exports.getAppointmentById = getAppointmentById
module.exports.getAppointments = getAppointments
module.exports.checkIn = checkIn