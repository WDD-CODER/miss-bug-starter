import { userService } from './user.service.remote.js'

export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser,
}

const BASE_URL = '/api/auth/'

function login({ username, password }) {
    return axios.get(BASE_URL, { params: username })
        .then(user => {
            if (user && user.password === password) return _setLoggedinUser(user)
            return Promise.reject('Invalid login')
        })
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