// import {  } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BASE_URL = '/api/bug'




export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy) {
console.log('query')

    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            return bugs
        })
}

function getById(bugId) {    
    return axios.get(BASE_URL, bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}



function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}