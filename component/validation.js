const Joi = require("@hapi/joi")
//register validation
const registerValidation = (data)=>{
    const schema =Joi.object({
        firstName: Joi.string().min(1).max(255).required(),
        lastName: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().pattern(new RegExp('^(SYSTEM_ADMIN|CLIENT_ADMIN)$')).required().messages({"string.pattern.base": "There is no such role."})
    })
    return schema.validate(data)
}
const loginValidation=(data)=>{
    const schema =Joi.object( {
        
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}
module.exports.registerValidation=registerValidation
module.exports.loginValidation=loginValidation
