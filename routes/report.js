const router = require("express").Router()
const { auth } = require('./verifyToken')
const { getAppointments } = require('../controller/reportController')

router.get('/appointments', async (req, res) => {
    return await getAppointments(req, res)
})

module.exports = router