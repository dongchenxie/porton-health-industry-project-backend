const router = require("express").Router()
const User = require("../model/User")
const {auth} = require("./vertifyToken")
router.get("/",auth,(req,res)=>{
    res.json({posts:{title:"my first post",user:req.user}})
})
module.exports = router