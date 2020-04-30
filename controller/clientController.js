const Appointment = require('../model/Appointment')
const Clinic = require('../model/Clinic')
const Patient = require('../model/Patient')
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
        appointment.appoimentTime = req.body.appoimentTime
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
    const { page = 1, perPage = 10, sort_by = 'appointmentTime.asc', search, start_date = Date.now, end_date = Date.now } = req.query
    let searchString = new RegExp(search, "i")
    let sorter = {}
    sorter[sort_by.split('.')[0]] = sort_by.indexOf('.asc') != -1 ? 1 : -1
    try {
        const appointments = await Appointment
            .find({
                // $or: [
                //     { doctorName: searchString },
                //     { reason: searchString },
                //     { comment: searchString }
                // ],
                // $and: [
                //     { appoimentTime: { $gte: start_date, $lte: end_date } },
                // ]
            })
            .select("-__v")
            .populate(
                "patient",
                "-__v",
                {
                    $or: [
                        { firstName: searchString },
                        { lastName: searchString },
                        { careCardNumber: searchString },
                        { phoneNumber: searchString },
                        { email: searchString }
                    ]
                },
                { sort: sorter }
            )
            .limit(Number(perPage))
            .skip((page - 1) * perPage)
            .sort(sorter)
            .exec()

        const total = await Appointment
            .find({
                // $or: [
                //     { doctorName: searchString },
                //     { reason: searchString },
                //     { comment: searchString }
                // ],
                // $and: [
                //     { appoimentTime: { $gte: start_date, $lte: end_date } },
                // ]
            })
            .populate(
                "patient",
                null,
                {
                    $or: [
                        { firstName: searchString },
                        { lastName: searchString },
                        { age: searchString },
                        { careCardNumber: searchString },
                        { phoneNumber: searchString },
                        { email: searchString },
                        { comment: searchString }
                    ]
                },
                null
            )
            .countDocuments()

        return res.status(200).send({
            appointments,
            totalResults: total,
            perPage: perPage,
            totalPages: Math.ceil(total / perPage),
            currentPage: page,
            nextPage: page + 1 >= Math.ceil(total / perPage) ? null : page + 1,
            prevPage: page - 1 <= 0 ? null : page - 1
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Failed to get appointments." })
    }
}

module.exports.getAppointmentById = getAppointmentById
module.exports.updateAppointmentById = updateAppointmentById
module.exports.getAppointments = getAppointments