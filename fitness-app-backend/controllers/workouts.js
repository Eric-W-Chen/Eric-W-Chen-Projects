const WorkoutSession = require('../models/WorkoutSession')
const User = require('../models/User')
const Location = require('../models/Location')
const Participant = require('../models/Participant')

module.exports = {
    fetchWorkouts: async (req, res) => {
        try {
            let workouts = await WorkoutSession.find()
            res.json(workouts)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    fetchUserWorkouts: async (req, res) => {
        const { pageNum } = req.body
        let startIdx = pageNum * 10 - 10
        let endIdx = pageNum * 10 
        let length;
        try {
            let workoutHistory = await WorkoutSession.find({ userId: req.auth.id })
            length = workoutHistory.length
            workoutHistory = workoutHistory
                .sort((a,b) => {
                    if (new Date(b.startDate) < new Date(a.startDate)) {
                        return 1
                    } else {
                        return -1
                    }
                })
                .slice(startIdx, endIdx)
            res.json({workoutHistory, length})
        } catch (err) {
            res.status(500).json({ error: err })
        }
    },
    checkin: async (req, res) => {
        // 1 degree of latitude is 69 miles
        // 1 degree of longitude is 54.6 miles
        const checkIfLocationWithinOneTenthMileRadius = (currentLat, currentLong, validLocations) => {
            for (let i = 0; i < validLocations.length; i++) {
                let location = validLocations[i]
                const lat = location.coordinates.latitude
                const long = location.coordinates.longitude
                let degreesLat = (1 / 69) * 0.005 * lat
                let degreesLong = (1 / 54.6) * 0.0005 * long

                let rightLat = lat + degreesLat
                let leftLat = lat - degreesLat
                let rightLong = long + degreesLong
                let leftLong = long - degreesLong
                if (currentLat < rightLat && currentLat > leftLat && currentLong > rightLong && currentLong < leftLong) {
                    return {
                        locationName: location.name,
                        isValid: true
                    }
                }
            }
            return { isValid: false }
        }

        try {
            const { username, location } = req.body;
            const { latitude, longitude } = location;

            // const user = await User.findOne({ username })
            const user = await User.findById(req.auth.id)
            if (!user) return res.status(400).send({ error: 'User not found' })
            const validLocations = await Location.find()
            const { isValid, locationName } = checkIfLocationWithinOneTenthMileRadius(latitude, longitude, validLocations)
            if (!isValid) return res.status(400).json({ error: 'You are currently not at a valid location to check in' })

            let workouts = await WorkoutSession.find({ userId: user._id })

            let workout;
            if (workouts.length === 0) {
                workout = new WorkoutSession({ userId: user._id, location: locationName, startTime: Date.now() })
            } else {
                // let sortedWorkouts = workouts.sort((a,b) => new Date(b.startTime) - new Date(a.startTime))
                let previousWorkout = workouts[workouts.length - 1]
                if (!previousWorkout.endTime && new Date(previousWorkout.startTime).toLocaleDateString() === new Date(Date.now()).toLocaleDateString()) return res.status(400).json({ error: 'You are already checked in for a workout'})
                if (new Date(previousWorkout.startTime).toLocaleDateString() === new Date(Date.now()).toLocaleDateString()) return res.status(400).json({ error: 'You have already completed a workout to earn points for today' })
                workout = new WorkoutSession({ userId: user._id, location: locationName, startTime: Date.now() })
            }
            await workout.save()
            // const { points } = user
            // return res.json({ username: user.username, points })
            return res.json(workout)
        } catch (err) {
            res.status(500).json({ error: err });
        }
    },
    checkout: async (req, res) => {
        const { competitionId, location } = req.body
        const { latitude, longitude } = location
    
        const timeDifference = (date1, date2) => {
            date1 = new Date(date1)
            date2 = new Date(date2)
            if (date1 == 'Invalid Date') return { hoursDifference: 0, minutesDifference: 0 }
            var difference = date1.getTime() - date2.getTime();

            var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
            difference -= daysDifference * 1000 * 60 * 60 * 24

            var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
            difference -= hoursDifference * 1000 * 60 * 60

            var minutesDifference = Math.floor(difference / 1000 / 60);
            difference -= minutesDifference * 1000 * 60

            var secondsDifference = Math.floor(difference / 1000);

            return { hoursDifference, minutesDifference }
        }

        const checkIfLocationWithinOneTenthMileRadius = (currentLat, currentLong, validLocations) => {
            for (let i = 0; i < validLocations.length; i++) {
                let location = validLocations[i]
                const lat = location.coordinates.latitude
                const long = location.coordinates.longitude
                let degreesLat = (1 / 69) * 0.005 * lat
                let degreesLong = (1 / 54.6) * 0.0005 * long

                let rightLat = lat + degreesLat
                let leftLat = lat - degreesLat
                let rightLong = long + degreesLong
                let leftLong = long - degreesLong
                if (currentLat < rightLat && currentLat > leftLat && currentLong > rightLong && currentLong < leftLong) {
                    return {
                        locationName: location.name,
                        isValid: true
                    }
                }
            }
            return { isValid: false }
        }

        try { 

            let participant = await Participant.findOne({ competition: competitionId, user: req.auth.id })
            let user = await User.findById(req.auth.id)
            let workouts = await WorkoutSession.find({ userId: user._id })
            let workout = workouts[workouts.length - 1]
            if (new Date(workout.startTime).toLocaleDateString() === new Date(Date.now()).toLocaleDateString() && workout.endTime) return res.status(400).json({ error: 'You have already completed a workout to earn points for today' })

            const validLocations = await Location.find()
            const { isValid } = checkIfLocationWithinOneTenthMileRadius(latitude, longitude, validLocations)
            if (!isValid) return res.status(400).json({ error: 'You are currently not at a valid location to check out' })

            if (workouts.length === 0) {
                return res.status(400).json({error: 'You have not checked in for a workout yet'})
            } else {
                if (!workout.endTime && new Date(workout.startTime).toLocaleDateString() === new Date(Date.now()).toLocaleDateString()) {
                    let { hoursDifference, minutesDifference } = timeDifference(Date.now(), workout.startTime)
                    workout.duration.hours = hoursDifference
                    workout.duration.minutes = minutesDifference
                    workout.endTime = new Date(Date.now())
                    let totalMinutes = (hoursDifference * 60) + minutesDifference
                    let pointsEarned = totalMinutes * (200/120)
                    if (pointsEarned > 200) pointsEarned = 200
                    participant.points += Math.round(pointsEarned)
                    if (participant.points > 6000) participant.points = 6000
                    await workout.save()
                    await participant.save()
                    return res.json({workout, pointsEarned: Math.round(pointsEarned)})
                } else if (!workout.endTime && new Date(workout.startTime).toLocaleDateString() !== new Date(Date.now()).toLocaleDateString()) {
                    participant.points += 50
                    await participant.save()
                    return res.status(400).json({ error: "Oh no you forgot to check out yesterday! Don't worry, you still earned 50 points."})
                } else {
                    return res.status(400).json({ error: 'You have not checked in for a workout yet' })
                }
            }
        } catch (err) {
            res.status(500).json({ error: err })
        }
    } 
}