import fs from 'fs'

export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}
export function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

export function writeJsonFile(path, json) {
    const data = JSON.stringify(json, null, 4)

    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

// export function getTruthyValues(obj) {
//     const newObj = {}
//     for (const key in obj) {
//         if (obj[key]) newObj[key] = obj[key]
//     }
//     return Object.entries(newObj)
//         .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
//         .join('&')
// }
