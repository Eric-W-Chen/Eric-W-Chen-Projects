const express = require('express')
const { auth } = require('../middleware/auth')
const UserController = require('../controllers/users')

const router = express.Router()
const LocationsController = require('../controllers/locations')

router.get('/', LocationsController.fetchLocations)
router.post('/', UserController.requireLogin, auth, LocationsController.createLocationRequest)
/* we create a / route, we first check to see if the user credentials to login, 
and once the user is logged in we grab the auth token from the cookie and pass
it into the locations controller to create a location request */
router.get('/requests', LocationsController.fetchLocationRequest)

module.exports = router