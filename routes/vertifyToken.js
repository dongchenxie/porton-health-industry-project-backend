const jwt = require('jsonwebtoken')

module.exports.auth = function(role){
    return function(req,res,next){
    const token = req.header("auth-token")
     console.log(role)
    if(!token) return res.status(401).send("Missing auth token")
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        console.log(verified)
        req.user = verified
        req.role=role
        next()
    }catch(e){
        res.status(400).send("Invalid Token");
    }
    
}}