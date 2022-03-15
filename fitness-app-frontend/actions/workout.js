import axios from 'axios'
import { API } from '../config'

export const checkinUser = (username, location, token) => {
    return axios.post(`${API}/workouts/checkin`, { username, location }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export const checkoutUser = (location, token, competitionId) => {
    return axios.post(`${API}/workouts/checkout`, { location, competitionId } , {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export const getWorkoutHistory = (token, pageNum) => {
    return axios.post(`${API}/workouts/history`, { pageNum }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}