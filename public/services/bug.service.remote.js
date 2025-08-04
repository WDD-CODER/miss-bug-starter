
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
    return axios.get(BASE_URL, { params: filterBy })
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
    console.log("🚀 ~ save ~ bug:", bug)
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data).catch(console.error)
    }
    else  return axios.post(BASE_URL, bug).then(res => res.data).catch(console.error)
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

