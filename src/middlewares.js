const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')
const { invalidCredentials } = require('./errors')

exports.authentication = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const authError = { error: invalidCredentials.message }

    if (!authHeader) {
        return res.json(authError)
    }

    const [_, token] = authHeader.split(' ')

    if (!token) {
        return res.json(authError)
    }

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.json(authError)
        }

        req.userId = payload.sub
        next()
    })
}