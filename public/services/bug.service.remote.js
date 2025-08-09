const BASE_URL = '/api/bug/'
const COOKIE_URL = '/cookie'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getVisitedBugs,
    resetCookie,
    onDownloadPDF,
}

function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function onDownloadPDF(filterBy) {
    return axios.get('file/pdf', { params: filterBy })
        .then(res => res.data)

}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug).then(res => res.data).catch(console.error)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data).catch(console.error)
    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, sortby: 'title', sortDir: 1 }
}

function getVisitedBugs() {
    return axios.get(COOKIE_URL)
        .then(res => res.data)
        .catch(err => showErrorMsg('problem fetching visited bugs'))
}

function resetCookie() {
    return axios.delete(COOKIE_URL)
        .then(res => res.data)
        .catch(err => showErrorMsg('problem resetting bugs visits'))
}

