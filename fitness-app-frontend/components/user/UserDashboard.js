import { useState, useEffect } from "react"
import { getCookie, isAuth } from "../../actions/auth"
import { getWorkoutHistory, checkinUser, checkoutUser } from "../../actions/workout";
import { getCurrentCompetitionLeaderboards } from "../../actions/leaderboards";
import { fetchUserRegisteredCompetitions } from "../../actions/competitions";
import ReactLoading from 'react-loading';
import WorkoutHistoryTable from "../admin/tables/WorkoutHistoryTable";
import RegisteredCompetitionsTable from "../admin/tables/RegisteredCompetitionsTable";


const UserDashboard = () => {

    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(false)
    const [checkinLoading, setCheckinLoading] = useState(false)
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const [workoutHistory, setWorkoutHistory] = useState([])
    const [workoutHistoryLength, setWorkoutHistoryLength] = useState(0)
    const [leaderboardPosition, setLeaderboardPosition] = useState(null)
    const [points, setPoints] = useState(null)
    const [currentCompetition, setCurrentCompetition] = useState(null)
    const [isCompeting, setIsCompeting] = useState(false)
    const [registeredCompetitions, setRegisteredCompetitions] = useState([])

    const [page, setPage] = useState(1)

    useEffect(() => {
        setLoading(true)
        let token = getCookie('token')
        setToken(token)
        fetchUserRegisteredCompetitions(token)
            .then(res => setRegisteredCompetitions(res.data))
        getWorkoutHistory(token, 1)
            .then(res => {
                setWorkoutHistory(res.data.workoutHistory)
                setWorkoutHistoryLength(res.data.length)
                getCurrentCompetitionLeaderboards()
                    .then(res => {
                        if (res.data) {
                            let participants = res.data.participants
                                .sort((a, b) => b.points - a.points)
                            let participantIds = participants
                                .map(participant => participant.user._id)
                            setCurrentCompetition(res.data)
                            if (participantIds.includes(isAuth()._id)) {
                                let index = participantIds.indexOf(isAuth()._id)
                                setLeaderboardPosition(index + 1)
                                setPoints(participants[index].points)
                                setIsCompeting(true)
                            }
                        }
                        setLoading(false)
                    })
            })
            .catch(err => console.log(err))
    }, [])

    const getLifetimeExerciseDuration = () => {
        if (workoutHistory.length > 0) {
            let hours = 0
            let minutes = 0
            let totalMinutes = 0
            workoutHistory.forEach(workout => {
                if (workout.duration) {
                    hours += workout.duration.hours
                    minutes += workout.duration.minutes
                }
            })
            totalMinutes = (hours * 60) + minutes
            let finalHours = Math.floor(totalMinutes / 60)
            let finalMinutes = (totalMinutes) % 60
            return { finalHours, finalMinutes }
        } 
        return { finalHours: 0, finalMinutes: 0 }
    }

    const handleCheckin = () => {
        if (!isCompeting) {
            setError('Competition has not started yet.')
            return
        }
        setCheckinLoading(true)
        navigator.geolocation.getCurrentPosition(pos => {
            checkinUser('', { latitude: pos.coords.latitude, longitude: pos.coords.longitude }, token)
                .then(res => {
                    setMessage('You have successfully checked in!')
                    setWorkoutHistory([res.data, ...workoutHistory])
                    setWorkoutHistoryLength(workoutHistoryLength + 1)
                    setCheckinLoading(false)
                    getCurrentCompetitionLeaderboards()
                        .then(res => {
                            if (res.data) {
                                let participants = res.data.participants
                                    .sort((a, b) => b.points - a.points)
                                let participantIds = participants
                                    .map(participant => participant.user._id)
                                setCurrentCompetition(res.data)
                                if (participantIds.includes(isAuth()._id)) {
                                    let index = participantIds.indexOf(isAuth()._id)
                                    setLeaderboardPosition(index + 1)
                                    setPoints(participants[index].points)
                                }
                            }
                        })
                })
                .catch(err => {
                    setError(err.response.data.error)
                    setCheckinLoading(false)
                })
        })
    }

    const handleCheckout = () => {
        if (!isCompeting) {
            setError('Competition has not started yet.')
            return
        }
        setCheckoutLoading(true)
        navigator.geolocation.getCurrentPosition(pos => {
            checkoutUser({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }, token, currentCompetition._id)
                .then(res => {
                    
                    setMessage(`Congrats! You worked out for ${res.data.workout.duration.hours}h ${res.data.workout.duration.minutes}m and earned ${res.data.pointsEarned} points`)
                    setCheckoutLoading(false)
                    let filtered = workoutHistory.filter(el => el._id !== res.data._id)
                    setWorkoutHistory([...filtered, res.data.workout])
                    getCurrentCompetitionLeaderboards()
                        .then(res => {
                            if (res.data) {
                                let participants = res.data.participants
                                    .sort((a, b) => b.points - a.points)
                                let participantIds = participants
                                    .map(participant => participant.user._id)
                                setCurrentCompetition(res.data)
                                if (participantIds.includes(isAuth()._id)) {
                                    let index = participantIds.indexOf(isAuth()._id)
                                    setLeaderboardPosition(index + 1)
                                    setPoints(participants[index].points)
                                }
                            }
                        })
                })
                .catch(err => {
                    setError(err.response.data.error)
                    setCheckoutLoading(false)
                    getCurrentCompetitionLeaderboards()
                        .then(res => {
                            if (res.data) {
                                let participants = res.data.participants
                                    .sort((a, b) => b.points - a.points)
                                let participantIds = participants
                                    .map(participant => participant.user._id)
                                setCurrentCompetition(res.data)
                                if (participantIds.includes(isAuth()._id)) {
                                    let index = participantIds.indexOf(isAuth()._id)
                                    setLeaderboardPosition(index + 1)
                                    setPoints(participants[index].points)
                                }
                            }
                        })
                    setLoading(false)
                })
        })
    }

    const handlePageChange = (flip) => e => {
        e.preventDefault();
        if (flip === 'next') {
            setPage(page + 1)
            getWorkoutHistory(token, page + 1)
                .then(res => setWorkoutHistory(res.data.workoutHistory))
        } else if (flip === 'prev') {
            setPage(page - 1)
            getWorkoutHistory(token, page - 1)
                .then(res => setWorkoutHistory(res.data.workoutHistory))
        }
    }

    return loading ? <div className="d-flex justify-content-center"><ReactLoading type="spokes" color="black" style={{ width: '3rem' }} /></div> : (
        <div>
            <div className="container">
                <div className="d-flex flex-column">
                    <button disabled={!registeredCompetitions.length} className="btn btn-primary m-1 mt-3" onClick={handleCheckin}>{checkinLoading ? <div className="d-flex justify-content-center"><ReactLoading type="spokes" color="black" style={{ width: '1rem' }}/></div> : 'Checkin'}</button>
                    <button disabled={!registeredCompetitions.length} className="btn btn-secondary m-1" onClick={handleCheckout}>{checkoutLoading ? <div className="d-flex justify-content-center"><ReactLoading type="spokes" color="black" style={{ width: '1rem' }}/></div> : 'Checkout'}</button>
                    {message ? <p className="alert alert-success m-1">{message}</p> : null}
                    {error ? <p className="alert alert-danger m-1">{error}</p> : null}
                </div>
                {!registeredCompetitions.length ? <div className="d-flex flex-column">
                    <p className="alert alert-primary m-1">You have not registered for a competition yet.</p>
                </div> : null}
                <div className="d-flex justify-content-between mt-5 admin-stats-container">
                    <div className="p-1 pl-5 pr-5 text-center" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                        <p>Leaderboard Position</p>
                        <h1>{isCompeting ? '#'+leaderboardPosition : 'N/A'}</h1>
                    </div>
                    <div className="p-1 pl-5 pr-5 text-center" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                        <p>Points</p>
                        <h1>{isCompeting ? points : 'N/A'}</h1>
                    </div>
                    <div className="p-1 pl-5 pr-5 text-center" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                        <p>Total Workouts</p>
                        <h1>{workoutHistoryLength}</h1>
                    </div>
                    <div className="p-1 pl-5 pr-5 text-center" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                        <p>Lifetime Exercise Duration</p>
                        <h1>{`${getLifetimeExerciseDuration().finalHours}h ${getLifetimeExerciseDuration().finalMinutes}m`}</h1>
                    </div>
                </div>

                <hr className='divider' />
                <div className="table-responsive p-3" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                    <h1>Registered Competitions</h1>
                    {/* <UsersTable users={users} /> */}
                    <RegisteredCompetitionsTable
                        registeredCompetitions={registeredCompetitions} />
                </div>
                <hr className='divider' />
                <div className="table-responsive p-3" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                    <h1>Workout History</h1>
                    {/* <UsersTable users={users} /> */}
                    <WorkoutHistoryTable 
                        workouts={workoutHistory} 
                        handlePageChange={handlePageChange} 
                        workoutHistoryLength={workoutHistoryLength}
                        page={page}/>
                </div>
                <hr className='divider' />
            </div>
        </div>
    )
}

export default UserDashboard