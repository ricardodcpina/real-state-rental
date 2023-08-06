const express = require('express')
const app = express()

const usersController = require('./controllers/users_controller')

app.use('/', express.json())
app.use('/users', usersController)

exports.app = app