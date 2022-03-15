const mongoose = require('mongoose')

const WorkoutSessionSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    location: {
        type: String
    },
    duration: {
        hours: { type: Number },
        minutes: { type: Number }
    }
})

module.exports = mongoose.model('Workout Session', WorkoutSessionSchema)