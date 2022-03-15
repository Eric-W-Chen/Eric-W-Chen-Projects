const mongoose = require('mongoose')
const crypto = require('crypto')

const UserSchema = mongoose.Schema({
    username: { 
        type: String,
        trim: true,
        required: true,
        max: 32,
        unique: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: Number,
        default: 0
    },
    profile: {
        type: String
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    resetPasswordLink: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

UserSchema.virtual('password')
    .set(function (password) {
        // create temporary variable called _password
        this._password = password
        // generate salt
        this.salt = this.makeSalt()
        // encrypt password
        this.hashedPassword = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword
    },
    encryptPassword: function (password) {
        if (!password) return ''

        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            if (err) return ''
        }
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random() + '')
    }
}

module.exports = mongoose.model('User', UserSchema)