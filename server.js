import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'
import { onCreatePdf } from './public/services/onCreatePdf.js'
import { userService } from './services/user.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {
    const filter = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        label: req.query.label || '',
        pageIdx: req.query.pageIdx
    }

    const sort = {
        sortBy: req.query.sortBy || 'title',
        sortDir: req.query.sortDir || 1
    }

    bugService.query(filter, sort)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(err)
            res.status(500).send(err)
        })
})



app.post('/api/bug', (req, res) => {
    loggerService.debug('req.body', req.body)

    const { title, severity, description, labels = [] } = req.body
    const bug = {
        title: title || 'No Title',
        severity: +severity,
        description,
        labels
    }

    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.put('/api/bug', (req, res) => {
    loggerService.debug('req.body', req.body)

    const { title, severity, _id, description, labels = [] } = req.body
    const bug = {
        title: title || 'No Title',
        severity: +severity,
        _id,
        description,
        labels
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
    let visitedBugs = req.cookies.visitedBugs || []

    bugService.getById(bugId)
        .then(bug => {
            if (!visitedBugs.includes(bugId)) visitedBugs.unshift(bugId)
            if (visitedBugs.length > 3) return res.send('no bug')
            res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
            return res.send(bug)
        })
        .catch(err => {
            loggerService.error(`Couldn't find bug ${bugId}`)
            res.status(400).send(err)
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(() => res.send(`bug ${bugId} removed`))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send("Couldn't find bug to remove")
        })
})

app.delete('/cookie', (req, res) => {
    res.clearCookie('visitedBugs')
    res.send(`We've cleared your seen bugs count. You can see more now`)
})

app.get('/cookie', (req, res) => {
    const visitedBugs = req.cookies.visitedBugs
    res.send(visitedBugs)
})



app.get('/file/pdf', (req, res) => {
    const filter = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        label: req.query.label || '',
        pageIdx: req.query.pageIdx
    }

    const sort = {
        sortBy: req.query.sortBy || 'title',
        sortDir: req.query.sortDir || 1
    }

    bugService.query(filter, sort)
        .then(onCreatePdf)
        .then(filePath => res.download(filePath, 'bugs.pdf'))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

/////////////////////////////////////////////////////////

app.get('/api/user', (req, res) => {
    console.log('/api/user')

    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            console.log('err', err)
            res.status(400).send("Couldn't get users")
        })
})


app.get('/api/user/:username', (req, res) => {
    const { username } = req.params
    // let visitedBugs = req.cookies.visitedBugs || []

    userService.getByUsername(username)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error(`Couldn't find user ${username}`)
            res.status(400).send(err)
        })
})

app.post('/api/user', (req, res) => {
    loggerService.debug('req.body', req.body)
    const { fullname, username, isAdmin } = req.body
    const user = {
        username,
        fullname,
        isAdmin
    }

    userService.add(user)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error(`Couldn't add user ${user}`)
            res.status(400).send(err)
        })
})

app.put('/api/user', (req, res) => {
    loggerService.debug('req.body', req.body)
    const { _id, fullname, username, isAdmin } = req.body
    const user = {
        _id,
        username,
        fullname,
        isAdmin
    }

    userService.add(user)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error(`Couldn't update user ${user}`)
            res.status(400).send(err)
        })
})

app.delete('/api/user/:username', (req, res) => {
    const username = req.params.username
    console.log("🚀 ~ username:", username)
    userService.remove(username)
        .then(() => res.send(`user ${username} removed`))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send("Couldn't find username to remove")
        })
})



/////////////////////////////////////////////////////////


app.get('*all', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'))
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
