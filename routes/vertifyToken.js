const jwt = require('jsonwebtoken')

module.exports.auth = function(req,res,next){
    const token = req.header("auth-token")
  
    if(!token) return res.status(401).send("Missing auth token")
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        console.log(verified)
        req.user =verified
        next()
    }catch(e){
        res.status(400).send("Invalid Token");
    }
    
}