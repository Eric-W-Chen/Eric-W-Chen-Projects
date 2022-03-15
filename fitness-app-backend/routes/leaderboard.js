const express = require('express')
const router = express.Router()
const LeaderboardController = require('../controllers/leaderboard')
const UsersController = require('../controllers/users')
const { auth } = require('../middleware/auth')

router.get('/', LeaderboardController.getCurrentCompetitionLeaderboards)

module.exports = router