import express from 'express'
import { makeId, readJsonFile } from './services/util.service.js'
import { bugService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.get('/api/bug', (req, res) => {

    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('err', err);
        })
})


app.get('/api/bug/save', (req, res) => {
    const { title, severity, _id } = req.query

    const bug = {
        title,
        severity: +severity,
        _id,
    }

    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
})


app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.getById(bugId + 1)
        .then(bug =>  res.send(bug))
        .catch(err => {
            loggerService.error(err)
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

app.listen(3030, () => loggerService.info('Server ready at port 3030'))