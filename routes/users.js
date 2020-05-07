const router = require("express").Router()
const { auth } = require("./verifyToken");
const { getUsersController } = require("../controller/authController")

//GetUsers
router.get("/", auth('SYSTEM_ADMIN'), async (req, res) => {
  return await getUsersController(req, res)
})

module.exports = router