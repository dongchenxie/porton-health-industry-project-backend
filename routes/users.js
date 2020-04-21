const router = require("express").Router()
const { getUsersController } = require("../controller/authController")

//GetUsers
router.get("/", async (req, res) => {
  return await getUsersController(req, res)
})

module.exports = router