import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

const users = readJsonFile('./data/users.json')

export const userService = {
    query,
    getById,
    getByUsername,
    add,
    remove
}


function query() {
    const usersToShow = users
    if (users.length > 0) return Promise.resolve(usersToShow)
    else return Promise.reject('no users ')
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) {
        return Promise.reject("can't find user")
    }
    return Promise.resolve(user)
}

function getByUsername(username) {
    const user = users.find(user => user.username === username)
    if (!user) {
        return Promise.reject("can't find user")
    }
    return Promise.resolve(user)
}

function add(userToAdd) {
    if (userToAdd._id) {
        console.log("🚀 ~ add ~ users:", users)
        const idx = users.findIndex(user => user._id === userToAdd._id)
        console.log("🚀 ~ add ~ idx:", idx)
        users[idx] = { ...users[idx], ...userToAdd }
    } else {
        userToAdd._id = makeId()
        users.unshift(userToAdd)
    }

    return _saveUsers().then(() => userToAdd)
}

function remove(username) {
    console.log("🚀 ~ remove ~ username:", username)
    const idx = users.findIndex(user => user.username === username)
    if (idx === -1) return Promise.reject("can't find username to remove")
    users.splice(idx, 1)

    return _saveUsers()
}

function _saveUsers() {
    return writeJsonFile('./data/users.json', users)
}
