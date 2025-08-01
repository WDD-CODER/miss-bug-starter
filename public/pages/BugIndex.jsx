const { useState, useEffect } = React

import { bugService } from '../services/bug.service.remote.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [seenBugs, setSeenBugs] = useState([])


    useEffect(loadBugs, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {

        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + Date.now()),
            severity: +prompt('Bug severity?', 3),
            description: prompt('What Happened?', 'What did the bug cause')
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const description = prompt('What Happened?', 'What did the bug cause')

        const bugToSave = { ...bug, severity, description }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onResetCookie() {
        bugService.resetCookie()
    }

    function onSetSeenBugs() {
        bugService.getSeenBugs()
            .then(res => {
                const count = res.seenBugs
                setSeenBugs(count)
            })
            .catch(err => {
                console.log('err', err);
                showErrorMsg(' Failed fetching bugs from Server')
            })

    }
    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <button >{seenBugs.length}</button>
            <button onClick={onAddBug}>Add Bug</button>
        </header>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug}
            onSetSeenBugs={onSetSeenBugs}
            onResetCookie={onResetCookie}
        />
    </section>
}
