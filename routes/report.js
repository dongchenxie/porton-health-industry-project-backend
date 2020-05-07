const router = require("express").Router()
const { auth } = require('./verifyToken')
const { getAppointments, getPatients } = require('../controller/reportController')

router.get('/appointments', auth('SYSTEM_ADMIN'), async (req, res) => {
    return await getAppointments(req, res)
})

router.get('/patients', auth('SYSTEM_ADMIN'), async (req, res) => {
    return await getPatients(req, res)
})

module.exports = router