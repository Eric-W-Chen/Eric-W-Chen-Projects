const User = require('../models/User')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

// sendgrid email
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username: username.toLowerCase() })
    
            if (!user) return res.status(400).json({ error: 'User does not exist'})
            if (!user.authenticate(password)) return res.status(400).json({ error: 'Invalid credentials'})
            
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        
            res.cookie('token', token, { expiresIn: '1d'} )
            const { _id, email, role, points  } = user
            return res.json({ 
                token, 
                user: { _id, username, email, role, points } 
            })
        } catch (err) {
            return res.status(400).json({error: err})
        } 
    },
    register: async (req, res) => {
        try {
            const { username, email, password, confirmPassword } = req.body
            let user = await User.findOne({ email })
            let userUsername = await User.findOne({ username })
            if (userUsername) return res.status(400).json({ error: 'Username is not available' })
            if (user) return res.status(400).json({ error: 'Email already registered' })
            if (password !== confirmPassword) return res.status(400).json({error: 'Passwords do not match'})
            let profile = process.env.NODE_ENV === 'development' ? `${process.env.CLIENT_URL_DEV}/profile/${username}` : `${process.env.CLIENT_URL2}/profile/${username}`

            let newUser = new User({ username: username.toLowerCase(), email, password, profile, timestamp: new Date('January 9, 2021 03:24:00') })
            await newUser.save()
            
            // send email after user registration
            const emailData = {
                to: email,
                from: 'fitrewardsproto@gmail.com',
                subject: `${process.env.APP_NAME} - WELCOME`,
                html: `
                <div style="background: #F1F2F4; width: 100%; padding-top: 50px; padding-bottom: 50px;">
                    <div style="margin: 20px; background: white; text-align: center;">
                        <h1 style="padding: 15px 20px;">WELCOME TO FIT REWARDS 💪</h1>
                        <button>Check out your profile</button>
                    </div>

                    <div style="margin: 10px; background: white; text-align: center;">
                        <h1 style="padding: 15px 20px;">This is a description of something</h1>
                    </div>

                    <div style="margin: 10px; background: white; text-align: center;">
                        <h1 style="padding: 15px 20px;">This is another description of something</h1>
                    </div>
        
                </div>
                `
            }
            // sgMail.send(emailData)
            //     .then(res => console.log(res))
            //     .catch(err => console.log(err))
            res.json({
                message: 'Registration successful! Please log in'
            })
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token')
            res.json({ message: 'Logged out successfully!'})

        } catch (err) {
            return res.status(400).json({error: err})
        }
    },
    requireLogin: expressJwt({
        secret: process.env.JWT_SECRET,
        algorithms: ["HS256"], 
        userProperty: "auth",
    }),
    read: async (req, res) => {
        req.profile.hashedPassword = undefined
        return res.json(req.profile)
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            let user = await User.findOne({ email })
            if (!user) return res.status(401).json({ error: 'User with that email does not exist' })
            const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' })

            const emailData = {
                to: email,
                from: 'fitrewardsproto@gmail.com',
                subject: `${process.env.APP_NAME} - RESET PASSWORD`,
                html: `
                <p>Please use the following link to reset your password</p>
                <a>${process.env.CLIENT_URL2}/auth/password/reset/${token}</a>
            `
            }

            user.resetPasswordLink = token
            await user.save()
            sgMail.send(emailData).then(() => {
                return res.json({ message: 'Email to reset password has been sent!' })
            })
        } catch (err) {
            res.status(500).json({error: 'Something went wrong'})
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { resetPasswordLink, newPassword } = req.body
            let user = await User.findOne({ resetPasswordLink })

            if (!user) return res.status(400).json({ error: 'Link is invalid or has expired'})

            const decoded = await jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD)

            if (decoded) {
                user.password = newPassword
                user.resetPasswordLink = ''
                await user.save()
                return res.json({ message: 'Password reset successfully!'})
            }
        } catch (err) {
            res.status(500).json({error: 'Link is invalid or has expired' })
        }
    }
}