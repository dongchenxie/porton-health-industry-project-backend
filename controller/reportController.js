const { appointmentsReportValidation, patientsReportValidation } = require('../component/validation')
const Appointment = require('../model/Appointment')
const Patient = require('../model/Patient')
const mongoose = require('mongoose')
const getAppointments = async (req, res) => {
    const { error } = appointmentsReportValidation(req.query)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const { clinic_id, sort_by = 'patient.lastName.asc', page = 1, perPage = 10, start_date, end_date } = req.query
    const _page = Number(page)
    const _perPage = Number(perPage)
    let sorter = {}
    sorter[sort_by.substring(0, sort_by.lastIndexOf('.'))] = sort_by.indexOf('.asc') != -1 ? 1 : -1
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
        let matchObject = {
            $match: {
                appointmentTime: { $gte: startDate, $lte: endDate }
            }
        }

        if (clinic_id) {
            matchObject.$match.clinic = mongoose.Types.ObjectId(clinic_id)
        }

        return matchObject
    }

    const projectHelper = (query) => {
        const nameMap = {
            lastName: 'patient.lastName',
            appointmentTime: 'appoimentTime',
            phoneNumber: 'patient.phoneNumber',
            careCardNUmber: 'patient.careCardNumber',
            gender: 'patient.gender',
            status: 'status',
            comment: 'comment',
            clinic: 'clinic'
        }

        let projectObject = {
            $project: {
                __v: 0,
                "patient.__v": 0,
                "patient.appointments": 0
            }
        }

        for (let key in query) {
            if (req.query[key] == 'false') {
                projectObject.$project[nameMap[key]] = 0
            }
        }

        return projectObject
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
                        projectHelper(req.query)
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

const getPatients = async (req, res) => {
    const { error } = patientsReportValidation(req.query)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const { clinic_id, sort_by = 'firstName.asc', page = 1, perPage = 10, start_date, end_date } = req.query
    const _page = Number(page)
    const _perPage = Number(perPage)
    let sorter = {}
    sorter[sort_by.substring(0, sort_by.lastIndexOf('.'))] = sort_by.indexOf('.asc') != -1 ? 1 : -1
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
        let matchObject = {
            $match: {
                'appointments.appointmentTime': { $gte: startDate, $lte: endDate }
            }
        }

        if (clinic_id) {
            matchObject.$match['appointments.clinic'] = mongoose.Types.ObjectId(clinic_id)
        }

        return matchObject
    }

    const projectHelper = (query) => {
        let projectObject = {
            $project: {
                __v: 0,
                "appointments.__v": 0
            }
        }

        for (let key in query) {
            if (req.query[key] == 'false') {
                projectObject.$project[key] = 0
            }
        }

        return projectObject
    }

    try {
        let patients = await Patient.aggregate([
            {
                $lookup: {
                    from: Appointment.collection.name,
                    localField: "appointments",
                    foreignField: "_id",
                    as: "appointments"
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
                        projectHelper(req.query)
                    ]
                }
            }
        ])

        patients = patients[0];
        const total = patients.metadata[0]
            ? patients.metadata[0].totalResults
            : 0
        patients.metadata = {
            currentPage: _page,
            perPage: _perPage,
            totalResults: total,
            totalPages: Math.ceil(total / _perPage),
            nextPage: _page + 1 > Math.ceil(total / _perPage) ? null : _page + 1,
            prevPage: _page - 1 <= 0 ? null : _page - 1
        }

        patients.data.forEach(patient => {
            if (req.query['age'] != 'false') {
                patient['age'] = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()

            }

            if (clinic_id && req.query['number_of_visits'] != 'false') {
                let count = 0
                patient.appointments.forEach(appointment => {
                    if (clinic_id == appointment.clinic) {
                        count++
                    }
                })
                patient['number_of_visits'] = count
            }

            if (clinic_id && req.query['last_visit'] != 'false') {
                patient.appointments.sort((a, b) => {
                    return new Date(b.appointmentTime) - new Date(a.appointmentTime)
                })
                patient['last_visit'] = patient.appointments[0].appointmentTime
            }

        })

        if (clinic_id) {
            if (sorter == 'number_of_visits.asc') {
                patients.sort((a, b) => {
                    return a.data.number_of_visits - b.data.number_of_visits
                })
            } else if (sorter == 'number_of_visits.desc') {
                patients.sort((a, b) => {
                    return b.data.number_of_visits - a.data.number_of_visits
                })
            } else if (sorter == 'last_visit.asc') {
                patients.sort((a, b) => {
                    return new date(a.data.last_visit) - new date(b.data.last_visit)
                })
            } else if (sorter == 'last_visit.desc') {
                patients.sort((a, b) => {
                    return new date(b.data.last_visit) - new date(a.data.last_visit)
                })
            }
        }

        return res.status(200).send(patients)
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Failed to get appointments." })
    }
}

module.exports.getAppointments = getAppointments
module.exports.getPatients = getPatients