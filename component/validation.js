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
        clinic: Joi.string().min(1).max(255)
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
        appointmentTime: Joi.date().required(),
        doctorName: Joi.string().min(1).max(255).required(),
        reason: Joi.string().min(1).max(255).required(),
        status: Joi.string().pattern(/^(NOT_SHOW|PENDING|CHECK_IN)$/).messages({ "string.pattern.base": "Status is undefined." }).required(),
        comment: Joi.string().min(1).max(255).required(),
        clinic: Joi.string().min(1).max(255).required(),
        patient: Joi.string().min(1).max(255).required()
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


const getTerminalsValidation = data => {
    const schema = Joi.object({
        search: Joi.string().min(1).max(255),
        page: Joi.number().integer().min(1),
        perPage: Joi.number().integer().min(1),
        sort_by: Joi.string().pattern(/^(name.asc|name.desc|status.asc|status.desc)$/).messages({ "string.pattern.base": "Sorter is undefined." })
    })
    return schema.validate(data)
}

const updateTerminalValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255),
        status: Joi.string().pattern(/^(ENABLED|DISABLED|DELETED)$/).messages({ "string.pattern.base": "Status is undefined." }),
        verificationContent: Joi.string().min(1)
    })
    return schema.validate(data)
}

const getTerminalAppointmentsValidation = data => {
    const schema = Joi.object({
        page: Joi.number().integer().min(1),
        perPage: Joi.number().integer().min(1),
        min_ahead: Joi.number().integer().min(1)
    })
    return schema.validate(data)
}

const terminalCheckInValidation = (data, verificationContent) => {
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(255)
            .when('$firstName', {
                is: Joi.boolean().valid(true).required(),
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        lastName: Joi.string().min(1).max(255)
            .when('$lastName', {
                is: Joi.boolean().valid(true).required(),
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        phoneNumber: Joi.string().min(1).max(255)
            .when('$phoneNumber', {
                is: Joi.boolean().valid(true).required(),
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        phoneNumberLast4: Joi.string().min(4).max(4)
            .when('$phoneNumberLast4', {
                is: Joi.boolean().valid(true).required(),
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        careCardNumber: Joi.string().min(1).max(255)
            .when('$careCardNumber', {
                is: Joi.boolean().valid(true).required(),
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        careCardLast4: Joi.string().min(4).max(4)
            .when('$careCardLast4', {
                is: Joi.boolean().valid(true).required(),
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        dateOfBirth: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({ "string.pattern.base": "Date of brith format error. Please follow the format: YYYY-MM-DD." })
            .when('$dateOfBirth', {
                is: Joi.boolean().valid(true).required(),
                then: Joi.required(),
                otherwise: Joi.optional()
            })
    })
    return schema.validate(data, { context: verificationContent })
}

const appointmentsReportValidation = data => {
    const schema = Joi.object({
        appointmentTime: Joi.boolean(),
        lastName: Joi.boolean(),
        phoneNumber: Joi.boolean(),
        gender: Joi.boolean(),
        careCardNumber: Joi.boolean(),
        clinic: Joi.boolean(),
        status: Joi.boolean(),
        comment: Joi.boolean(),
        clinic_id: Joi.string().min(1).max(255),
        page: Joi.number().integer().min(1),
        perPage: Joi.number().integer().min(1),
        start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({ "string.pattern.base": "Date format error. Please follow the format: YYYY-MM-DD." }),
        end_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({ "string.pattern.base": "Date format error. Please follow the format: YYYY-MM-DD." }),
        sort_by: Joi.string().pattern(/^(appointmentTime.asc|appointmentTime.desc|patient.phoneNumber.asc|patient.phoneNumber.desc|patient.gender.asc|patient.gender.desc|patient.lastName.asc|patient.lastName.desc|patient.careCardNumber.asc|patient.careCardNumber.desc|status.asc|status.desc)$/).messages({ "string.pattern.base": "Sorter is undefined." })
    })
    return schema.validate(data)
}

const patientsReportValidation = data => {
    const schema = Joi.object({
        firstName: Joi.boolean(),
        lastName: Joi.boolean(),
        age: Joi.boolean(),
        gender: Joi.boolean(),
        careCardNumber: Joi.boolean(),
        mrp: Joi.boolean(),
        last_visit: Joi.boolean(),
        phoneNumber: Joi.boolean(),
        number_of_visits: Joi.boolean(),
        comment: Joi.boolean(),
        page: Joi.number().integer().min(1),
        perPage: Joi.number().integer().min(1),
        clinic_id: Joi.string().min(1).max(255),
        start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({ "string.pattern.base": "Date format error. Please follow the format: YYYY-MM-DD." }),
        end_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({ "string.pattern.base": "Date format error. Please follow the format: YYYY-MM-DD." }),
        sort_by: Joi.string().pattern(/^(firstName.asc|firstName.desc|phoneNumber.asc|phoneNumber.desc|lastName.asc|lastName.desc|careCardNumber.asc|careCardNumber.desc|gender.asc|gender.desc|mrp.asc|mrp.desc|dateOfBirth.asc|dateOfBirth.desc|last_visit.asc|last_visit.desc|number_of_visits.asc|number_of_visits.desc)$/).messages({ "string.pattern.base": "Sorter is undefined." })
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
module.exports.getAppointmentsValidation = getAppointmentsValidation;
module.exports.getTerminalsValidation = getTerminalsValidation;
module.exports.updateTerminalValidation = updateTerminalValidation;
module.exports.getTerminalAppointmentsValidation = getTerminalAppointmentsValidation;
module.exports.terminalCheckInValidation = terminalCheckInValidation;

module.exports.appointmentsReportValidation = appointmentsReportValidation
module.exports.patientsReportValidation = patientsReportValidation
