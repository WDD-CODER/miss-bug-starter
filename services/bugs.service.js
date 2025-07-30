import { loggerService } from './logger.service.js'
import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

var bugs = readJsonFile('./data/bugs.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

function query() {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    console.log('Looking for bugId:', bugId)
    console.log('Available IDs:', bugs.map(b => b._id))

    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) {
        return Promise.reject("can't find bug")
    }
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject("can't find bug to remove")
    bugs.splice(idx, 1)

    return _saveBugs()
}


function save(bugToSave) {

    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs = { ...bugs[idx], ...bugToSave }
    }
    else {
        bugToSave._id = makeId()
        bugToSave.created = Date.now()
        bugs.unshift(bugToSave)
    }

    return _saveBugs()
        .then(() => bugToSave)
}

function _saveBugs() {
    return writeJsonFile('./data/bugs.json', bugs)
}