const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

// app
const app = express()


// database
mongoose.connect(process.env.MONGO_URI).then(() => console.log('connected to database...'))

// middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// cors
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL_DEV}` }))
} else {
    app.use(cors({ origin: [`${process.env.CLIENT_URL1}`, `${process.env.CLIENT_URL2}`, `${process.env.CLIENT_URL3}`] }))
}

// routes
app.get('/', (req, res) => res.send('working'))
app.use('/auth', require('./routes/auth'))
app.use('/admin', require('./routes/admin'))
app.use('/locations', require('./routes/locations'))
app.use('/workouts', require('./routes/workouts'))
app.use('/leaderboard', require('./routes/leaderboard'))
app.use('/competitions', require('./routes/competitions'))

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`listening on port ${port}`))
