const Terminal = require('../model/Terminal')
const jwt = require('jsonwebtoken')

const terminalAuth = async (req, res, next) => {
    const token = req.header('terminal-token')
    if (!token) {
        return res.status(401).send({ error: "Missing terminal token." })
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        const terminal = await Terminal.findById({ _id: verified._id })

        if (terminal) {
            if (terminal.status == 'DELETED') {
                return res.status(401).send({ error: "This terminal has been deleted." })
            } else if (terminal.status == 'DISABLED') {
                return res.status(400).send({ error: "This terminal has been disabled." })
            }
        }
        req.terminal = verified
        next()
    } catch (err) {
        return res.status(401).send({ error: "Not authorized." })
    }
}

module.exports.terminalAuth = terminalAuth