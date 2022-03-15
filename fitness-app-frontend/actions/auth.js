import axios from 'axios'
import { API } from '../config'
import cookie from 'js-cookie'

export const registerUser = (user) => {
    return axios.post(`${API}/auth/register`, user)
}

export const loginUser = (user) => {
    return axios.post(`${API}/auth/login`, user)
}

export const logoutUser = (next) => {
    removeCookie('token')
    removeLocalStorage('user')
    next()

    return axios.post(`${API}/auth/logout`)
}

export const resetPassword = (resetPasswordLink, newPassword) => {
    return axios.put(`${API}/auth/reset-password`, { resetPasswordLink, newPassword })
}

export const forgotPassword = (email) => {
    return axios.put(`${API}/auth/forgot-password`, { email })
}

// export const checkinUser = (username, location) => {
//     return axios.post(`${API}/auth/checkin`, { username, location })
// }

export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, { expires: 1 })
    }
}

export const removeCookie = (key) => {
    if (process.browser) {
        cookie.remove(key, { expires: 1 })
    }
}

export const getCookie = (key) => {
    if (process.browser) {
        return cookie.get(key)
    }
}

export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key)
    }
}

export const authenticate = (data, next) => {
    setCookie('token', data.token)
    setLocalStorage('user', data.user)
    next()
}

export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token')
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false
            }
        }
    }
}