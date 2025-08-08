

export const userService = {
    query,
    getById,
    getByUsername,
    add,
    getEmptyCredentials,
}

const BASE_URL = '/'

function query() {
    return storageService.query(KEY)
}

function getById(userId) {
    return storageService.get(KEY, userId)
}

function getByUsername(username) {
    return storageService.query(KEY)
        .then(users => users.find(user => user.username === username))
}

function add(user) {
    const { username, password, fullname } = user
    if (!username || !password || !fullname) return Promise.reject('Missing credetials')
        // היה יותר נכון לחסוך פעולה מול השרת ולבצע קריאה אחת לשרת ולטפל בעניין שם ור להחזיר החוצה תשובה 
    return getByUsername(username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username taken')

            return storageService.post(KEY, user)
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
    storageService.post(KEY, admin)
}