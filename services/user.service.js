import { makeId, readJsonFile, writeJsonFile } from './util.service.js'
import fs from 'fs'
var users = readJsonFile('./data/users.json')

export const userService = {
    query,
    getById,
    getByUsername,
    add,
    remove
}


function query() {
    const usersToReturn = users.map(user => ({ _id: user._id, fullname: user.fullname }))
    return Promise.resolve(usersToReturn)
}

function getById(userId) {
    var user = users.find(user => user._id === userId)
    if (!user) return Promise.reject("can't find user")

    user = { ...user }
    delete user.password

    return Promise.resolve(user)
}

function getByUsername(username) {
    var user = users.find(user => {
        return user.username === username;
    })
    return Promise.resolve(user)
}

function add(user) {
    return userService.getByUsername(user.username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('User Name Already exist try a different one')
            user._id = makeId()
            users.push(user)

            return _saveUsersToFile()
                .then(() => {
                    user = { ...user }
                    delete user.password
                    return user
                })

        })



}

function remove(userId) {
    if (!users.some(user => user._id === userId)) return Promise.reject(`Didn't find user ${userId}`)
    users = users.filter(user => user._id !== userId)
    return _saveUsersToFile()
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/users.json', usersStr, err => {
            if (err) reject(console.log(err))
            resolve()
        })
    })
}

