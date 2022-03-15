const User = require('../models/User')
const Competition = require('../models/Competition')

module.exports = {
    getCurrentCompetitionLeaderboards: async (req, res) => {
        let competitions = await Competition
            .find()
            .populate({
                path: 'participants',
                model: 'Participant',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: '-hashedPassword -resetPasswordLink -salt -email -role -profile -timestamp'
                }
            })
        let now = new Date(Date.now())
        let currentCompetition
        try {
            competitions.forEach(comp => {
                let start = new Date(new Date(comp.startDate)
                    .setDate(new Date(comp.startDate).getDate() - 1))
                let end = comp.endDate

                if (now >= start && now < end) currentCompetition = comp
            })
            
            res.json(currentCompetition)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    }
}