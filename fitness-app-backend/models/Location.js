const mongoose = require('mongoose')

const LocationSchema = mongoose.Schema({
    name: {
        type: String
    },
    address: {
        type: String
    },
    coordinates: {
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    }
})

module.exports = mongoose.model('Location', LocationSchema)