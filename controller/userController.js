// const User = require("../model/User")
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")
// const { validationResult } = require('express-validator')

// const getUserById = async (req, res, next) => {
//     const userId = req.params.userId    
//     let user
//     try {
//         user = await User.findById((userId), '-password')
//     }  catch (err) {
//         return res.status(500).send({error:err})
//     }

//     if(!user) {
//         return res.status(404).send("register error")
//     }

//     res.json({ user : user.toObject({ getters: true }) })
// }


// exports.getUserById = getUserById