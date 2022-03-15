const express = require('express')
const router = express.Router()
const AdminController = require('../controllers/admin')
const UsersController = require('../controllers/users')
const LocationsController = require('../controllers/locations')
const { admin } = require('../middleware/auth')


router.get('/data', UsersController.requireLogin, admin, AdminController.fetchData)
router.post('/addLocation', UsersController.requireLogin, admin, AdminController.addLocation)
router.post('/location/delete', UsersController.requireLogin, admin, AdminController.deleteLocation)
router.post('/location/deleteRequest', LocationsController.deleteLocationRequest)

module.exports = router