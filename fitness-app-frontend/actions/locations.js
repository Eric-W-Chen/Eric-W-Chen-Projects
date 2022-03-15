import axios from 'axios'
import { API } from '../config'

export const fetchLocations = () => {
    return axios.get(`${API}/locations`)
}

export const fetchLocationRequests = () => {
    return axios.get(`${API}/locations/requests`)
}