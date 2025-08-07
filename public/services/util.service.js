

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function loadFromStorage(keyDB) {
    const val = localStorage.getItem(keyDB)
    return JSON.parse(val)
}

export function saveToStorage(keyDB, val) {
    const valStr = JSON.stringify(val)
    localStorage.setItem(keyDB, valStr)
}


export function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, content => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}



export function httpGet(url) {
    const protocol = url.startsWith('https') ? https : http
    const options = {
        method: 'GET',
    }
    return new Promise((resolve, reject) => {
        const req = protocol.request(url, options, res => {
            let data = ''

            res.on('data', chunk => {
                data += chunk
            })

            res.on('end', () => {
                resolve(data)
            })
        })
        req.on('error', err => {
            reject(err)
        })
        req.end()
    })
}

export function createBugs(count = 1) {
    const bugs = []
    for (let i = 0; i < count; i++) {
        bugs.push(getEmptyBug())
    }
    return bugs
}

export function getEmptyBug() {
    return {
        title: '',
        severity: 1,
        description: '',
        labels: [],
    }
}
