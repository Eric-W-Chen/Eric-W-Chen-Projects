import axios from 'axios'
import { API } from '../config'

export const fetchCompetitions = () => {
    return axios.get(`${API}/competitions`)
}

export const fetchUserRegisteredCompetitions = (token) => {
    return axios.get(`${API}/competitions/participating`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
}

export const joinCompetition = (token, id) => {
    return axios.post(`${API}/competitions/join`, { id }, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
}