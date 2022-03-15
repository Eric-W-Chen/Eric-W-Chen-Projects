import axios from 'axios'
import { API } from '../config'

export const fetchAllData = (token) => {
    return axios.get(`${API}/admin/data`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export const deleteLocation = (id, token) => {
    return axios.post(`${API}/admin/location/delete`, { id }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export const deleteLocationRequest = (id, token) => {
    return axios.post(`${API}/admin/location/deleteRequest`, { id }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export const addValidLocation = (textAddress, name, token) => {
    return axios.post(`${API}/admin/addLocation`, { textAddress, name }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export const createCompetition = (data) => {
    return axios.post(`${API}/competitions`, data)
}

export const deleteAllCompetitions = () => {
    return axios.post(`${API}/competitions/delete`)
}