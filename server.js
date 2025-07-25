import express from 'express'
import { bugService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))

app.get('/api/bug', (req, res) => {
    
// C:\קודינג אקדמי\Lesson38-NodeServer\miss-bug\miss-bug-starter\index.html
    bugService.query()
        .then(bugs => {res.send(bugs)})
        .catch(err => {
            console.log('err', err);
        })
})


app.get('/api/bug/save', (req, res) => {
    const { title, severity, _id, description } = req.query

    const bug = {
        title,
        severity: +severity,
        _id,
        description,
    }

    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
})


app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.getById(bugId)
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
const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
