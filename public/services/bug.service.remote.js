
const BASE_URL = '/api/bug'
const COOKIE_URL = '/cookie'


export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getVisitedBugs,
    resetCookie,
}

function query(filterBy) {
    return axios.get(BASE_URL, {params: filterBy})
        .then(res => res.data)
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
    var queryStr = `/save?title=${bug.title}&severity=${bug.severity}`
    if (bug._id) queryStr += `&_id=${bug._id}`
    if (bug.description) queryStr += `&description=${bug.description}`
    if (bug.label) queryStr += `&label=${bug.label}`
    return axios.get(BASE_URL + queryStr)
        .then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}

function getVisitedBugs() {
    return axios.get(COOKIE_URL)
        .then(res => res.data)
        .then(res => res)
        .catch(err => showErrorMsg('problem showing bugs visits'))
}

function resetCookie() {
   return axios.get(COOKIE_URL + '/remove')
        .then(res => res.data)
        .then(res => res)
        .catch(err => showErrorMsg('problem resting bugs visits'))
}
