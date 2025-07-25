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
    return axios.get(`${BASE_URL}/${bugId}`)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.get(`${BASE_URL}/${bugId}/remove`)
        .then(res => res.data)
}

function save(bug) {
    console.log("🚀 ~ save ~ bug:", bug)
    var queryStr = `/save?title=${bug.title}&severity=${bug.severity}`
    if (bug._id) queryStr += `&_id=${bug._id}`
    if (bug.description) queryStr += `&description=${bug.description}`
        console.log("🚀 ~ save ~ queryStr:", queryStr)
        return axios.get(BASE_URL + queryStr)
            .then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}