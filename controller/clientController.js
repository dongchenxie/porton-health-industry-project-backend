const Appointment = require('../model/Appointment')
const Clinic = require('../model/Clinic')
const Patient = require('../model/Patient')
const User = require('../model/User')
const { updateAppointmentValidation, getAppointmentsValidation } = require('../component/validation')

const getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params
    try {
        const appointment = await Appointment
            .findById(appointmentId)
            .select("-__v")
        return res.status(200).send(appointment)
    } catch (err) {
        return res.status(400).send({ error: "Invalid appointment ID." })
    }
}

const updateAppointmentById = async (req, res) => {
    const { error } = updateAppointmentValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const { appointmentId } = req.params
    let appointment = {}
    // Check if appointment exists
    try {
        const appt = await Appointment.findById(appointmentId)
        if (appt) {
            appointment = appt
        }
    } catch (err) {
        return res.status(400).send({ error: "Invalid appointment ID." })
    }
    // Update appointment in clinic
    try {
        if (appointment.clinic && appointment.clinic != req.body.clinic) {
            const oldClinic = await Clinic.findById(appointment.clinic)
            oldClinic.appointments.pull(appointment._id)
            oldClinic.save()
            const newClinic = await Clinic.findById(req.body.clinic)
            newClinic.appointments.push(appointment._id)
            newClinic.save()
        } else if (!appointment.clinic && req.body.clinic) {
            const newClinic = await Clinic.findById(req.body.clinic)
            newClinic.appointments.push(appointment._id)
            newClinic.save()
        }
    } catch (err) {
        return res.status(400).send({ error: "Failed to update appointment in clinic." })
    }
    // Update appointment in patient
    try {
        if (appointment.patient && appointment.patient != req.body.patient) {
            const oldPatient = await Patient.findById(appointment.patient)
            oldPatient.appointments.pull(appointment._id)
            await oldPatient.save()
            const newPatient = await Patient.findById(req.body.patient)
            newPatient.appointments.push(appointment._id)
            await newPatient.save()
        } else if (!appointment.patient && req.body.patient) {
            const newPatient = await Patient.findById(req.body.patient)
            newPatient.appointments.push(appointment._id)
            await newPatient.save()
        }
    } catch (err) {
        return res.status(400).send({ error: "Failed to update appointment in patient." })
    }
    // Update clinic and patient in appointment
    try {
        appointment.appointmentTime = req.body.appointmentTime
        appointment.doctorName = req.body.doctorName
        appointment.reason = req.body.reason
        appointment.status = req.body.status
        appointment.comment = req.body.comment
        appointment.clinic = req.body.clinic
        appointment.patient = req.body.patient
        await appointment.save()
        return res.status(200).send(appointment)
    } catch (err) {
        return res.status(400).send({ error: "Failed to update appointment." })
    }
}

const getAppointments = async (req, res) => {
    const { error } = getAppointmentsValidation(req.query)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    // const userId = req.user._id
    const { page = 1, perPage = 10, sort_by = 'appointmentTime.asc', search, start_date, end_date } = req.query
    const _page = Number(page)
    const _perPage = Number(perPage)
    const startDate = start_date ? new Date(start_date) : Date.now
    const endDate = end_date ? new Date(end_date) : Date.now
    const searchString = new RegExp(search, "i")
    let sorter = {}
    sorter[sort_by.substring(0, sort_by.lastIndexOf('.'))] = sort_by.indexOf('.asc') != -1 ? 1 : -1

    try {
        // const user = await User.findById(userId)
        let appointments = await Appointment
            .aggregate([
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
                        // clinic: user.clinic,
                        appointmentTime: { $gt: startDate, $lt: endDate },
                        $or: [
                            { doctorName: searchString },
                            { reason: searchString },
                            { comment: searchString },
                            { "patient.firstName": searchString },
                            { "patient.lastName": searchString },
                            { "patient.careCardNumber": searchString },
                            { "patient.phoneNumber": searchString },
                            { "patient.email": searchString }
                        ]
                    }
                },
                {
                    $facet: {
                        metadata: [
                            { $count: "totalResults" }
                        ],
                        data: [
                            { $sort: sorter },
                            { $skip: (_page - 1) * _perPage },
                            { $limit: _perPage },
                            { $project: { __v: 0, "patient.__v": 0 } }
                        ]
                    }
                }
            ])

        appointments = appointments[0]
        const total = appointments.metadata[0] ? appointments.metadata[0].totalResults : 0
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

module.exports.getAppointmentById = getAppointmentById
module.exports.updateAppointmentById = updateAppointmentById
module.exports.getAppointments = getAppointments