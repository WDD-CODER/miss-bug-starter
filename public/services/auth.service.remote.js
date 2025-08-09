import { userService } from './user.service.remote.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = '/api/auth/'

export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser,
}


function login({ username, password }) {
    return axios.post(BASE_URL + 'login', { username, password })
        .then(res =>  res.data)
        .then(_setLoggedinUser) 
}

function signup(user) {
    return userService.add(user)
        .then(_setLoggedinUser)
        .catch(err => Promise.reject(err))
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _setLoggedinUser(user) {
    const userToSave = {
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin
    }

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}