const mongoose = require('mongoose')

const LocationRequestSchema = mongoose.Schema({
    location: {
        type: String
    },
    fitnessCenter: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Location Request', LocationRequestSchema)