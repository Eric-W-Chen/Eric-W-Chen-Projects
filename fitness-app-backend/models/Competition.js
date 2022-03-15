const mongoose = require('mongoose')

const CompetitionSchema = mongoose.Schema({
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    participants: {
        type: [{ 
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Participant'
        }],
        default: []
    },
    reward: {
        type: Number
    },
    participantLimit: {
        type: Number
    }
})

module.exports = mongoose.model('Competition', CompetitionSchema)