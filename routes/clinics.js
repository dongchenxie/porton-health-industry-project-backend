const router = require("express").Router()
const { getClinicsController } = require("../controller/authController")

//GetClinics
router.get("/", async (req, res) => {
  return await getClinicsController(req, res)
})

module.exports = router