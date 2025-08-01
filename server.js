import express from 'express'
import path from 'path'

import cookieParser from 'cookie-parser'
import { bugService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/bug/save', (req, res) => {
    loggerService.debug('req.query', req.query)
    const { title, severity, _id, description } = req.query
    const bug = {
        title: title || 'no title',
        severity: +severity,
        _id,
        description,
    }

    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})


app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || ''
    if (visitedBugs) visitedBugs = visitedBugs.split(',')

    bugService.getById(bugId)
        .then(bug => {
            console.log('User visited at the following bugs:', visitedBugs)
            if (!visitedBugs) res.cookie('visitedBugs', bugId, { maxAge: 1000 * 1000 * 7 })
            else {
                if (visitedBugs.includes(bugId)) return res.send(bug)
                else {
                    if (visitedBugs.length >= 3) return res.send('no bug')
                    visitedBugs += ',' + bugId
                    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 1000 * 7 })
                }
            }
            return res.send(bug)
        })
        .catch(err => {
            loggerService.error(`Couldn't find bug ${bugId}`)
            res.status(400).send(err)
        })

})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(() => res.send(`bug ${bugId} removed`))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send("Couldn't find bug to remove")
        })
})

app.get('/cookie', (req, res) => {
    let visitedBugs = req.cookies.visitedBugs
    res.send(visitedBugs)
})

app.get('/cookie/remove', (req, res) => {
    res.clearCookie('visitedBugs')
    res.send(`We've cleared your seen bugs count. You can see more now`)
})

app.get('*all', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'))
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
