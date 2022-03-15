const mongoose = require('mongoose')

const ParticipantSchema = mongoose.Schema({
    competition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competition'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    points: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Participant', ParticipantSchema)