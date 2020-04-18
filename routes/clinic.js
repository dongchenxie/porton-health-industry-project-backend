const router = require("express").Router()
const Clinic = require("../model/ClinicStatus")
const {auth} = require("./vertifyToken")
const enableCheckinController = require("../controller/clinicController")

//endpoint for enable/disable check-in service
router.put("/enableCheckIn", auth("CLIENT_ADMIN"), (req,res)=>{
    return await enableCheckinController(req, res)
})

module.exports = router