const BASE_URL = '/api/user/'


export const userService = {
    query,
    getById,
    // getByUsername,
    add,
    getEmptyCredentials,
}


function query() {
    return axios.get(BASE_URL).then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + userId).then(res => res.data)
}

// function getByUsername(username) {
//     return axios.get(BASE_URL + username)
//         .then(users => users.find(user => user.username === username))
        
// }

function add(user) {
    const { username, password, fullname } = user
    if (!username || !password || !fullname) return Promise.reject('Missing credetials')
        // היה יותר נכון לחסוך פעולה מול השרת ולבצע קריאה אחת לשרת ולטפל בעניין שם ור להחזיר החוצה תשובה 
    return getByUsername(username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username taken')

            return axios.post(BASE_URL, user)
                .then(user => {
                    delete user.password
                    return user
                })
        })
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

// _createAdmin()
function _createAdmin() {
    const admin = {
        username: 'admin',
        password: 'admin',
        fullname: 'Mustafa Adminov',
        isAdmin: true,
    }
    axios.post(BASE_URL, admin)
}