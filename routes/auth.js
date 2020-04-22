const router = require("express").Router()
const User = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const { registerValidation, loginValidation } = require("../component/validation")

const { registerController, loginController, getUserController, updateUserController, resetPasswordController, updatePermissionController } = require("../controller/authController")


const {
    registerController,
    loginController,
    getUserController,
    updateUserController,
    resetPasswordController,
    getTokenInformationController,
     updatePermissionController 
} = require("../controller/authController")
//validation


//Register
router.post("/register", async (req, res) => {
    return await registerController(req, res)
})

//Login
router.post("/login", async (req, res) => {
    return await loginController(req, res)
})

//GetUserById
router.get("/:userId", async (req, res) => {
    return await getUserController(req, res)
})

//UpdateUserById
router.put("/:userId", async (req, res) => {
    return await updateUserController(req, res)
})

//ResetPasswordById
router.put("/passwordReset/:userId", async (req, res) => {
    return await resetPasswordController(req, res)
})


//UpdatePermissionById
router.put("/permission/:userId", async (req, res) => {
    return await updatePermissionController(req, res)
})


router.get("/readToken/:token", async (req, res) => {
    return await getTokenInformationController(req, res)
})

module.exports = router