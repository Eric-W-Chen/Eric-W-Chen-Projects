const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/users')

// validation
const { runValidation } = require('../validators/index')
const { userSignupValidator, userLoginValidator } = require('../validators/auth')

// middleware
const { auth, admin } = require('../middleware/auth')

router.post('/login', userLoginValidator, runValidation, UsersController.login)
router.post('/register', userSignupValidator, runValidation, UsersController.register)
router.post('/logout', UsersController.logout)
// router.post('/checkin', UsersController.checkin)
router.put('/forgot-password', UsersController.forgotPassword)
router.put('/reset-password', UsersController.resetPassword)

router.get('/test', UsersController.requireLogin, (req, res) => {
    res.send('success')
})

router.get('/profile', UsersController.requireLogin, admin, UsersController.read)
module.exports = router