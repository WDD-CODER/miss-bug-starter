import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'
import { onCreatePdf } from './public/services/onCreatePdf.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'

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
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    loggerService.debug('req.body', req.body)

    const { title, severity, description, labels = [] } = req.body
    const bug = {
        title: title || 'No Title',
        severity: +severity,
        description,
        labels,
        creator: loggedinUser
    }

    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    loggerService.debug('req.body', req.body)

    const { title, severity, description, labels = [], creator } = req.body

    if ( !loggedinUser.isAdmin || creator.username !== loggedinUser.username ) {
        return res.status(401).send(' This is not your Bug. You cannot update it')
    }
    
    const bug = {
        title,
        severity,
        _id: req.params.bugId,
        description,
        labels,
        creator
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

// USER API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send("Couldn't get users")
        })
})


app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error(`Couldn't find user ${userId}`)
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
            loggerService.error(`Couldn't add user ${username}`)
            res.status(400).send(err)
        })
})


app.delete('/api/user/:userId', (req, res) => {
    const userId = req.params.userId
    userService.remove(userId)
        .then(() => res.send(`user ${userId} removed`))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send("Couldn't find userId to remove")
        })
})

// AUTH API 
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => {
            loggerService.error(`Couldn't login user ${credentials}`)
            res.status(404).send('Invalid Credentials')
        })
})

app.post('/api/auth/signup', (req, res) => {
    loggerService.debug('req.body', req.body)

    const credentials = req.body

    userService.add(credentials)
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            }
            else res.status(400).res.send('cannot signup')
        })
        .catch(err => {
            loggerService.error(`Couldn't add user ${credentials}`)
            res.status(400).send(err)
        })


})

// COOKIES API

app.delete('/cookie', (req, res) => {
    res.clearCookie('visitedBugs')
    res.send(`We've cleared your seen bugs count. You can see more now`)
})

app.get('/cookie', (req, res) => {
    const visitedBugs = req.cookies.visitedBugs
    res.send(visitedBugs)
})

// GENERAL API

app.get('*all', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'))
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
