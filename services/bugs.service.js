import { loggerService } from './logger.service.js'
import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

var bugs = readJsonFile('./data/bugs.json')

export const bugService = {
    query,
    getById,
    remove,
    save,
    getEmptyBug,
}

function query(filterBy = {}) {
    let bugsForDisplay = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsForDisplay = bugsForDisplay.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        bugsForDisplay = bugsForDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    return Promise.resolve(bugsForDisplay)
}

function getById(bugId) {
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
        bugs[idx] = { ...bugs[idx], ...bugToSave }
    } else {
        bugToSave._id = makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }

    return _saveBugs().then(() => bugToSave)
}

function _saveBugs() {
    return writeJsonFile('./data/bugs.json', bugs)
}

function getEmptyBug() {
    return {
        title: '',
        description: '',
        severity: 0,
        labels: []
    }
}
