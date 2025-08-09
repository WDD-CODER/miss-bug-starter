import Cryptr from 'cryptr'
import { userService } from '../public/services/user.service.remote.js'
import { promises } from 'dns'

const cryptr = new Cryptr(process.env.SECRET1 || 'secret')


export const authService = {
    checkLogin,
    getLoginToken,
    validateToken,
}

function checkLogin({ username, password }) {
    userService.getByUsername(username)
        .then(user => {
            if (user && user.password === password) {
                user = { ...user }
                delete user.password
                return promises.resolve(user)
            }
            return Promise.reject()
        })
}

function getLoginToken() {

}

function validateToken() {

}
