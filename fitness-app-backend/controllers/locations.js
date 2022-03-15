const Location = require('../models/Location')
const LocationRequest = require('../models/LocationRequest')

module.exports = {
    fetchLocations: async (req, res) => {
        try {
            let locations = await Location.find()
            res.json(locations)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },

    createLocationRequest: async (req, res) => {
        // console.log(req.auth.id);
        try {
            const {location, fitnessCenter} = req.body;
            const locationRequest = new LocationRequest({location: location, fitnessCenter: fitnessCenter, user: req.auth.id});
            // console.log(locationRequest);
            await locationRequest.save();
            res.send(locationRequest);
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    deleteLocationRequest: async (req, res) => {
        // console.log(req.auth.id);
        try {
            const {id} = req.body;
            let locationRequest = await LocationRequest.findByIdAndDelete(id);
            res.send(locationRequest);
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    fetchLocationRequest: async (req,res) => {
        try {
            let locationRequests = await LocationRequest.find();
            res.send(locationRequests);
        } catch (err) {
            res.status(500).json({ error: err })
        }
    }
}