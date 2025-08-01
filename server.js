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
        .then(bugs => { res.send(bugs) })
        .catch(err => {
            console.log('err', err);
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
})


app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let seenBugs = req.cookies.seenBugs || ''
    if (seenBugs) seenBugs = seenBugs.split(',')
    bugService.getById(bugId)
        .then(bug => {
            console.log('seenBugs3', seenBugs)
            if (!seenBugs)  res.cookie('seenBugs', bugId, { maxAge: 1000 * 1000 * 7 })
            else {
                if (seenBugs.includes(bugId)) return res.send(bug)
                else {
                    if (seenBugs.length >= 3) return res.send('no bug')
                        seenBugs += ',' + bugId
                        res.cookie('seenBugs', seenBugs, { maxAge: 1000* 1000 * 7 })
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
    let seenBugs = req.cookies.seenBugs
    res.send(seenBugs)
})

app.get('/cookie/remove', (req, res) => {
    console.log('remove')
    res.clearCookie('seenBugs')
    res.send(`We've cleared your seen bugs count. You can see more now`)
})

app.get('*all', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'))
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
