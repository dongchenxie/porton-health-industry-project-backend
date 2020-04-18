const User = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { registerValidation, loginValidation, updateValidation, resetPasswordValidation } = require("../component/validation")
const registerController = async (req, res) => {
    //validation
    const { error } = registerValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    //check if email exists in db
    const emailExist = await User.findOne({ email: req.body.email })//mongoose query
    if (emailExist) {
        return res.status(400).send({ error: "Email already exists." })
    }
    //hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //create new users
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    })
    try {
        await user.save()
        return res.status(201).send()//successfully created an account
    } catch (err) {
        return res.status(400).send({ error: err })
    }
}
const loginController = async (req, res) => {
    //validation
    const { error } = loginValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    //check email exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send({ error: "Email dose not exist." })
    }
    if (user.isEnabled == false) { return res.status(400).send({ error: "The account is not enabled." }) }
    //check password
    console.log(user)
    const vaildPass = await bcrypt.compare(req.body.password, user.password)
    if (!vaildPass) {
        return res.status(400).send({ error: "Incorrect login information." })
    }
    //Create token
    const exprieDate = new Date()
    exprieDate.setDate(exprieDate.getDate() + 14)
    console.log(exprieDate)
    const token = jwt.sign({ _id: user.id, expire_date: exprieDate }, process.env.TOKEN_SECRET)
    return res.header('auth-token', token).send({ token: token, role: user.role })
}
const getUserController = async (req, res) => {
    const { userId } = req.params
    try {
        const user = await User.findById(userId)
        return res.status(200).send(user)
    } catch (err) {
        return res.status(400).send({ error: "Invalid user Id." })
    }
}
const updateUserController = async (req, res) => {
    const { error } = updateValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const { userId } = req.params
    try {
        await User.findById(userId)
    } catch (err) {
        return res.status(400).send({ error: "Invalid user Id." })
    }
    // Check if any other user has the same email address
    const user = await User.findOne({ email: req.body.email })
    if (user && user._id != userId) {
        return res.status(400).send({ error: "Email already exists." })
    }
    try {
        await User.findByIdAndUpdate(userId, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role
        })
        return res.status(200).send()
    } catch (err) {
        return res.status(400).send({ error: "Failed to update user." })
    }
}
const resetPasswordController = async (req, res) => {
    const { error } = resetPasswordValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const { userId } = req.params
    try {
        await User.findById(userId)
    } catch (err) {
        return res.status(400).send({ error: "Invalid user Id." })
    }
    //hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    try {
        await User.findByIdAndUpdate(userId, {
            password: hashedPassword
        })
        return res.status(200).send()
    } catch (err) {
        return res.status(400).send({ error: "Invalid user Id." })
    }
}

module.exports.registerController = registerController
module.exports.loginController = loginController
module.exports.getUserController = getUserController
module.exports.updateUserController = updateUserController
module.exports.resetPasswordController = resetPasswordController