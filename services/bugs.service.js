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

function query(filter, sort) {
    let bugsForDisplay = bugs
    bugsForDisplay = bugsForDisplay.sort((bugA, bugB) => bugA.title.localeCompare(bugB.title) * sort.sortDir)

    if (filter.txt) {
        const regExp = new RegExp(filter.txt, 'i')
        bugsForDisplay = bugsForDisplay.filter(bug => regExp.test(bug.title))
    }

    if (filter.minSeverity) {
        bugsForDisplay = bugsForDisplay.filter(bug => bug.severity >= filter.minSeverity)
    }

    if (filter.label) {
        bugsForDisplay = bugsForDisplay.filter(bug => bug.labels.includes(filter.label))
    }

    if (sort.sortBy === 'severity' || sort.sortBy === 'createdAt') {
        bugsForDisplay = bugsForDisplay.sort((bugA, bugB) => (bugA[sort.sortBy] - bugB[sort.sortBy]) * sort.sortDir)
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
