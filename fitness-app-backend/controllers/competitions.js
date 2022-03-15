const User = require('../models/User')
const Competition = require('../models/Competition')
const Participant = require('../models/Participant')

module.exports = {
    createCompetition: async (req, res) => {
        try {
            const { startDate, endDate, reward, participantLimit } = req.body
            let date1 = new Date(startDate)
            let date2 = new Date(endDate)
            date1 = date1.setDate(date1.getDate())
            date2 = date2.setDate(date2.getDate() + 1)
            let competition = new Competition({
                startDate: date1,
                endDate: date2,
                reward,
                participantLimit
            })
            await competition.save()
            res.json(competition)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    fetchCompetitions: async (req, res) => {
        try {
            const competitions = await Competition.find().populate({
                path: 'participants',
                model: 'Participant',
                // select: '-hashedPassword -resetPasswordLink -salt -email -role -profile -timestamp'
            })
            res.json(competitions)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    fetchUserRegisteredCompetitions: async (req, res) => {
        try {
            let participants = await Participant.find({ user: req.auth.id }).populate('competition')
            competitions = participants.map(el => el.competition)
            res.json(competitions)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    joinCompetition: async (req, res) => {
        const { id } = req.body
        try {
            let competition = await Competition.findById(id)
            if (competition.participantLimit === competition.participants.length) return res.status(400).json({ error: 'Sorry, competition is full.'})
            let participant = await Participant.findOne({ competition: id, user: req.auth.id})
            if (participant) return res.status(400).json({ error: 'You are already participating in this competition' })
            participant = new Participant({ competition: competition._id, user: req.auth.id })
            await participant.save()
            competition.participants.push(participant._id)
            await competition.save()

            // if (competition.participants.includes(req.auth.id)) return res.status(400).json({ error: 'You are already participating in this competition'})
            // competition.participants.push(req.auth.id)
            // await competition.save()
            // let user = await User.findById(req.auth.id)
            // user.points = 0
            // await user.save()
            res.json(competition)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    deleteAllCompetitions: async (req, res) => {
        try {
            await Competition.deleteMany()
            res.json([])
        } catch (err) {
            res.status(500).json({ error: err })
        }
    }

}