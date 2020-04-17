const router = require("express").Router()
const User = require("../model/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {registerValidation,loginValidation} = require("../component/validation")
const {
    registerController,
    loginController
}=require("../controller/authController")
//validation

//Register
router.post("/register", async (req, res) => {
    return await registerController(req,res)
})
//Login
router.post("/login",async (req,res)=>{
    return await loginController(req,res)
})
//getUserById
router.get('/:userId', authController.getUserById )
module.exports = router