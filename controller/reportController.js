const { appointmentsReportValidation } = require('../component/validation')
const Appointment = require('../model/Appointment')
const Patient = require('../model/Patient')
const mongoose = require('mongoose')
const getAppointments = async (req, res) => {
    const { error } = appointmentsReportValidation(req.query)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const { lastName = true, appointmentTime = true, phoneNumber = true, careCardNumber = true, gender = true, status = true, comment = true, clinic = true, clinic_id, sort_by = 'patient.lastName.asc', page = 1, perPage = 10, start_date, end_date } = req.query
    const _lastName = lastName && lastName == 'false' ? 0 : 1
    const _appointmentTime = appointmentTime && appointmentTime == 'false' ? 0 : 1
    const _phoneNumber = phoneNumber && phoneNumber == 'false' ? 0 : 1
    const _careCardNumber = careCardNumber && careCardNumber == 'false' ? 0 : 1
    const _gender = gender && gender == 'false' ? 0 : 1
    const _status = status && status == 'false' ? 0 : 1
    const _comment = comment && comment == 'false' ? 0 : 1
    const _clinic = clinic && clinic == 'false' ? 0 : 1
    const _page = Number(page)
    const _perPage = Number(perPage)
    let sorter = {}
    sorter[sort_by.substring(0, sort_by.lastIndexOf('.'))] = sort_by.indexOf('.') != -1 ? 1 : -1
    let startDate;
    let endDate;
    if (start_date) {
        startDate = new Date(start_date)
    } else {
        startDate = new Date('1980-01-01')
    }

    if (end_date) {
        endDate = new Date(end_date)
        if (endDate < startDate) {
            return res.status(400).send({ error: "End date must be greater than start date." })
        }
    } else {
        endDate = new Date()
    }

    const matchHelper = (clinic_id) => {
        if (!clinic_id) {
            return (
                {
                    $match: {
                        appointmentTime: { $gte: startDate, $lte: endDate }
                    }
                }
            )
        } else {
            return (
                {
                    $match: {
                        clinic: mongoose.Types.ObjectId(clinic_id),
                        appointmentTime: { $gte: startDate, $lte: endDate }
                    }
                }
            )
        }
    }

    const projectHelper = (lastName) => {
        
        if (lastName && lastName == 'false') {
            return (
                {
                    $project: {
                        __v: 0,
                        "patient.__v": 0,
                        "patient.appointments": 0,
                        "patient.lastName": 0,
                        // "patient.phoneNumber": _phoneNumber,
                        // "patient.careCardNUmber": _careCardNumber,
                        // "patient.gender": _gender,
                        // "status": _status,
                        // "comment": _comment,
                        // "appointmentTime": _appointmentTime,
                        // "clinic": _clinic
                    }
                }
            )
        } else {
            return (
                {
                    $project: {
                        __v: 0,
                        "patient.__v": 0,
                        "patient.appointments": 0,
                        "patient.lastName": 1,
                        // "patient.phoneNumber": _phoneNumber,
                        // "patient.careCardNUmber": _careCardNumber,
                        // "patient.gender": _gender,
                        // "status": _status,
                        // "comment": _comment,
                        // "appointmentTime": _appointmentTime,
                        // "clinic": _clinic
                    }
                }
            )
        }

    }

    try {
        let appointments = await Appointment.aggregate([
            {
                $lookup: {
                    from: Patient.collection.name,
                    localField: "patient",
                    foreignField: "_id",
                    as: "patient"
                }
            },
            matchHelper(clinic_id),
            {
                $facet: {
                    metadata: [
                        { $count: "totalResults" }
                    ],
                    data: [
                        { $sort: sorter },
                        { $skip: (_page - 1) * _perPage },
                        { $limit: _perPage },
                        projectHelper(lastName)
                        // {
                        //     $project: {
                        //         __v: 0,
                        //         "patient.__v": 0,
                        //         "patient.appointments": 0,
                        //         "patient.lastName": convert(lastName),
                        //         // "patient.phoneNumber": _phoneNumber,
                        //         // "patient.careCardNUmber": _careCardNumber,
                        //         // "patient.gender": _gender,
                        //         // "status": _status,
                        //         // "comment": _comment,
                        //         // "appointmentTime": _appointmentTime,
                        //         // "clinic": _clinic
                        //     }
                        // }
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

module.exports.getAppointments = getAppointments