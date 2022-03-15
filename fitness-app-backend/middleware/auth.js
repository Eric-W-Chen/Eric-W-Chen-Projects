const User = require("../models/User")

module.exports = {
    
    auth: async (req, res, next) => {
        const authUserId = req.auth.id
        const user = await User.findById(authUserId)
        if (!user) return res.status(400).json({error: 'User not found'})
        req.profile = user
        next()
    },
    admin: async (req, res, next) => {
        const authUserId = req.auth.id
        const user = await User.findById(authUserId)
        if (!user) return res.status(400).json({ error: 'User not found.' })
        if (user.role !== 1) return res.status(400).json({ error: 'Access denied.' })
        req.profile = user
        next()
    }
}