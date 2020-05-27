const express = require('express')
const router = express.Router()

const { isAuthenticated } = require('./utils/auth')

router.get('/cart', isAuthenticated)

module.exports = router
