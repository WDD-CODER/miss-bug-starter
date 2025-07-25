import { loggerService } from './logger.service.js'
import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

const bugs = readJsonFile('./data/bugs.json')

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
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) {
        loggerService.error(`Couldn't find  Bugs id ${bugId} in bugs array`)
        return Promise.reject("can't find bug")
    }
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    return _saveBugs()
}


function save(bugToSave) {
    
    if (bugToSave._id) {
        // bug.id = _id
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    }
    else {
        bugToSave._id = makeId()
        bugs.push(bugToSave)
    }

    return _saveBugs()
        .then(() => bugToSave)
}

function _saveBugs() {
    return writeJsonFile('./data/bugs.json', bugs)
}