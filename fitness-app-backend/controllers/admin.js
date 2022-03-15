const User = require("../models/User")
const Location = require('../models/Location')
const Competition = require('../models/Competition')
const LocationRequest = require ('../models/LocationRequest')
const axios = require('axios')

module.exports = {
    fetchData: async (req, res) => {
        try {
            let users = await User.find()
            let locations = await Location.find()
            let locationRequests = await LocationRequest.find()
            let competitions = await Competition.find()
            res.json({users, locations, competitions, locationRequests})
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    addLocation: async (req, res) => {
        const { textAddress, name } = req.body 
        try {
            let { data } = await axios.get(`${process.env.POSITIONSTACK_URL}?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${textAddress}&limit=1`)
            const { latitude, longitude } = data.data[0]
            let newLocation = new Location({
                name: name.toLowerCase(),
                address: textAddress,
                coordinates: { latitude, longitude }
            })
            await newLocation.save()
            res.json(newLocation)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    deleteLocation: async (req, res) => {
        const { id } = req.body
        try {
            await Location.findByIdAndDelete(id)
            res.json({})
        } catch (err) {
            res.status(500).json({ error: err })
        }
    }
}

