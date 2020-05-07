const router = require("express").Router()
const { auth } = require("./verifyToken");
const { getClinicsController } = require("../controller/authController")

//GetClinics
router.get("/", auth("SYSTEM_ADMIN"), async (req, res) => {
  return await getClinicsController(req, res)
})

module.exports = router