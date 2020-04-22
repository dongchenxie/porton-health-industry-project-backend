const router = require("express").Router()
const User = require("../model/User")
const {auth} = require("./verifyToken")

//this route is an example of how to use custom middle ware
router.get("/",auth("CLIENT_ADMIN"),(req,res)=>{
    res.json({posts:{title:"my first post",user:req.user}})
})
module.exports = router