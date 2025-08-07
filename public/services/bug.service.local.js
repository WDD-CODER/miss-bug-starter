import { storageService } from 'async-storage.service.js'
import { loadFromStorage, saveToStorage } from './util.service.js'

const BAG_KEY = 'bugs'
const COOKIE_KEY = '/cookie'
const PAGE_SIZE = 3

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getVisitedBugs,
    resetCookie,
    // onDownloadPDF,
}

_createBugs()

function query(filter) {

    return storageService.query(BAG_KEY)
        .then(bugs => {
            console.log("🚀 ~ query ~ bugs:", bugs)
            let bugsForDisplay = [...bugs]

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

            if (filter.pageIdx !== undefined) {
                const startIdx = filter.pageIdx * PAGE_SIZE
                bugsForDisplay = bugsForDisplay.slice(startIdx, startIdx + PAGE_SIZE)
            }

            if (filter.sortBy) {
                if (filter.sortBy === 'title') {
                    bugsForDisplay = bugsForDisplay.sort((bugA, bugB) => bugA.title.localeCompare(bugB.title) * filter.sortDir)
                }
                else bugsForDisplay = bugsForDisplay.sort((bugA, bugB) => (bugA[filter.sortBy] - bugB[filter.sortBy]) * filter.sortDir)
            }


            return bugsForDisplay
        }
        )
}

// function onDownloadPDF(filterBy) {
//     return storageService.get('file/pdf', { params: filterBy })
//         .then(res => res.data)

// }

function getById(bugId) {
    return storageService.get(BAG_KEY, bugId)
        .then(res => res)
}

function remove(bugId) {
    return storageService.delete(BAG_KEY, bugId)
        .then(res => res)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(BAG_KEY, bug)
        .then(res => res).catch(console.error)
    } else {
        return storageService.post(BAG_KEY, bug)
        .then(res => res).catch(console.error)
    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, sortBy: 'title', sortDir: 1 }
}

function getVisitedBugs() {
    return storageService.query(COOKIE_KEY)
        .then(res => res)
        .catch(err => showErrorMsg('problem fetching visited bugs'))
}

function resetCookie() {
    return storageService.delete(COOKIE_KEY)
        .then(res => res)
        .catch(err => showErrorMsg('problem resetting bugs visits'))
}


function _createBugs() {

    let bugs = loadFromStorage(BAG_KEY)
    if (bugs && bugs.length > 0) return

    bugs = [
        {
            title: "Infinite Loop Detected",
            severity: 4,
            _id: "1NF1N1T3",
            description: '',
            labels: [],
            createdAt: Date.now()
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD",
            description: '',
            labels: [],
            createdAt: Date.now() + 1
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33",
            description: '',
            labels: [],
            createdAt: Date.now() + 2
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053",
            description: '',
            labels: [],
            createdAt: Date.now() + 3
        }
    ]
    saveToStorage(BAG_KEY, bugs)
}

