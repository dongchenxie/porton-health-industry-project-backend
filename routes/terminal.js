const router = require("express").Router()
const Terminal = require("../model/Terminal")
const {auth} = require("./verifyToken")

const {deleteTerminalController } = require("../controller/authController")

//Terminal Enable/Disable(Delete)
router.delete("client/terminal/:terminalId",auth("CLIENT_ADMIN"),(req,res)=>{
    return await deleteTerminalController(req, res)
})

module.exports = router