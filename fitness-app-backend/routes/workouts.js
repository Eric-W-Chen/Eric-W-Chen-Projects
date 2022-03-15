const express = require('express')
const router = express.Router()
const WorkoutController = require('../controllers/workouts')
const UsersController = require('../controllers/users')

const { auth } = require('../middleware/auth')

router.get('/', WorkoutController.fetchWorkouts)
router.post('/history', UsersController.requireLogin, auth, WorkoutController.fetchUserWorkouts)
router.post('/checkin', UsersController.requireLogin, auth, WorkoutController.checkin)
router.post('/checkout', UsersController.requireLogin, auth, WorkoutController.checkout)


module.exports = router