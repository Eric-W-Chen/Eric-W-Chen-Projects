const { check } = require('express-validator')

module.exports = {
    userSignupValidator: [
        check('username')
            .not()
            .isEmpty()
            .withMessage('Username is required'),
        check('email')
            .isEmail()
            .withMessage('Email must be valid email address'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
    ],
    userLoginValidator: [
        check('username')
            .not()
            .isEmpty()
            .withMessage('Username cannot be blank'),
        check('password')
            .not()
            .isEmpty()
            .withMessage('Password cannot be blank'),
    ]
}