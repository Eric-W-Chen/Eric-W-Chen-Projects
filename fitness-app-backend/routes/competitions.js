const express = require('express')
const router = express.Router()
const CompetitionsController = require('../controllers/competitions')
const UsersController = require('../controllers/users')

const { auth } = require('../middleware/auth')

router.get('/', CompetitionsController.fetchCompetitions)
router.get('/participating', UsersController.requireLogin, auth, CompetitionsController.fetchUserRegisteredCompetitions)
router.post('/', CompetitionsController.createCompetition) // admin only
router.post('/join', UsersController.requireLogin, auth, CompetitionsController.joinCompetition) 
router.post('/delete', CompetitionsController.deleteAllCompetitions) //admin only

module.exports = router