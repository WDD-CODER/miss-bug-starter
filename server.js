import express from 'express'
import { makeId, readJsonFile } from './services/util.service.js'

const app = express()

// const bugs = readJsonFile('./data/bugs.json')
const bugs = [
    {
        title: "Infinite Loop Detected",
        severity: 44,
        _id: "1NF1N1T3"
    },
    {
        title: "Infinite Loop Detected",
        severity: 4,
        _id: "1NF1N1T3"
    },
    {
        title: "Keyboard Not Found",
        severity: 3,
        _id: "K3YB0RD"
    },
    {
        title: "404 Coffee Not Found",
        severity: 2,
        _id: "C0FF33"
    },
    {
        title: "Unexpected Response",
        severity: 1,
        _id: "G0053"
    }
]

app.get('/api/bug', (req, res) => { res.send(bugs) })


app.get('/api/bug/save', (req, res) => {
    const { title, severity, _id } = req.query
    const bug = {
        title,
        severity:+severity
    }
    
    if (_id) {
        bug.id = _id
        const idx = bugs.findIndex(bug => bug._id === _id)
        bugs.splice(idx, 1, bug)
    }
    else {
        bug.id = makeId()
        bugs.push(bug)
    }
    res.send(bug)
})


app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    const bug = bugs.find(bug => bug._id === bugId)
    res.send(bug)
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.bugId
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    res.send(`bug ${bugId} removed`)

})

app.listen(3030, () => console.log('Server ready at port 3030'))