const Joi = require("@hapi/joi")

//register validation
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(255).required(),
        lastName: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().pattern(new RegExp('^(SYSTEM_ADMIN|CLIENT_ADMIN)$')).required().messages({ "string.pattern.base": "Access denied." })
    })
    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}

const updateValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(255).required(),
        lastName: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(5).required().email().required(),
        role: Joi.string().pattern(/^(SYSTEM_ADMIN|CLIENT_ADMIN)$/).required().messages({ "string.pattern.base": "Access denied." }).required(),
        clinic: Joi.string()
    })
    return schema.validate(data)
}

const resetPasswordValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}

const getUsersValidation = (data) => {
    const schema = Joi.object({
        search: Joi.string().min(1).max(255),
        perPage: Joi.number().integer().min(1),
        sort_by: Joi.string().pattern(/^(firstName.asc|firstName.desc|lastName.asc|lastName.desc|email.asc|email.desc|date.asc|date.desc|role.asc|role.desc)$/).messages({ "string.pattern.base": "Sorter is undefined." }),
        page: Joi.number().integer().min(1),
    })
    return schema.validate(data)
}

const updatePermission = data => {
    const schema = Joi.object({
        isEnabled: Joi.boolean().required()
    })
    return schema.validate(data)
}

const updateAppointmentValidation = data => {
    const schema = Joi.object({
        appointmentTime: Joi.date(),
        doctorName: Joi.string().min(1).max(255),
        reason: Joi.string().min(1).max(255),
        status: Joi.string().pattern(/^(NOT_SHOW|PENDING|CHECK_IN)$/).messages({ "string.pattern.base": "Status is undefined." }),
        comment: Joi.string().min(1).max(255),
        clinic: Joi.string().min(1).max(255),
        patient: Joi.string().min(1).max(255)
    })
    return schema.validate(data)
}

const getAppointmentsValidation = data => {
    const schema = Joi.object({
        page: Joi.number().integer().min(1),
        perPage: Joi.number().integer().min(1),
        search: Joi.string().min(1).max(255),
        sort_by: Joi.string().pattern(/^(doctorName.asc|doctorName.desc|appointmentTime.asc|appointmentTime.desc|patient.firstName.asc|patient.firstName.desc|patient.lastName.asc|patient.lastName.desc)$/).messages({ "string.pattern.base": "Sorter is undefined." }),
        start_date: Joi.date(),
        end_date: Joi.date()
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateValidation = updateValidation;
module.exports.resetPasswordValidation = resetPasswordValidation;
module.exports.getUsersValidation = getUsersValidation;
module.exports.updatePermission = updatePermission;
module.exports.updateAppointmentValidation = updateAppointmentValidation;
module.exports.getAppointmentsValidation = getAppointmentsValidation