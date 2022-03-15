import axios from 'axios'
import { API } from '../config'

export const getCurrentCompetitionLeaderboards = () => {
    return axios.get(`${API}/leaderboard`)
}