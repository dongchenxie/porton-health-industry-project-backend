const router = require("express").Router()
const { auth } = require('./verifyToken')

const { registerController, loginController, getUserController, updateUserController, resetPasswordController, updatePermissionController, getTokenInformationController } = require("../controller/authController")

//validationns:
//Register
router.post("/register", auth("SYSTEM_ADMIN"), async (req, res) => {
    return await registerController(req, res)
})

//Login
router.post("/login", async (req, res) => {
    return await loginController(req, res)
})

//GetUserById
router.get("/:userId", auth("SYSTEM_ADMIN"), async (req, res) => {
    return await getUserController(req, res)
})

//UpdateUserById
router.put("/:userId", auth("SYSTEM_ADMIN"), async (req, res) => {
    return await updateUserController(req, res)
})

//ResetPasswordById
router.put("/passwordReset/:userId", auth("SYSTEM_ADMIN"), async (req, res) => {
    return await resetPasswordController(req, res)
})


//UpdatePermissionById
router.put("/permission/:userId", auth("SYSTEM_ADMIN"), async (req, res) => {
    return await updatePermissionController(req, res)
})


router.get("/readToken/:token", async (req, res) => {
    return await getTokenInformationController(req, res)
})


module.exports = router