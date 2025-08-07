const { useState, useEffect } = React

import { bugService } from '../services/bug.service.local.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'


export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [sumOfBugs, setSumOfBugs] = useState()
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [visitedBugs, setVisitedBugs] = useState()
    useEffect(loadBugs, [filterBy])
    // useEffect(onSetVisitedBugs, [])
    useEffect(() => {

        if (sumOfBugs === 0) {
            setFilterBy(prevFilter => {
                prevFilter.pageIdx = 0
                return { ...prevFilter, ...filterBy }
            })
        }
    }, [sumOfBugs])

    // useEffect(() => {
    //     if (bugs) bugService.onDownloadPDF(filterBy)
    // }, [bugs])


    function loadBugs() {
        bugService.query(filterBy)
        .then(res => {
                setSumOfBugs(res.length)
                return setBugs(res)
            })
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setSumOfBugs(bugsToUpdate.length)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + Date.now()),
            severity: +prompt('Bug severity?', 3),
            description: prompt('What Happened?', 'What did the bug cause'),
            createdAt: Date.now(),
            labels:[]
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                setSumOfBugs(bugs.length + 1)
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const description = prompt('What Happened?', bug.description || 'What did the bug cause')
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
        setFilterBy(prevFilter => {
            if (filterBy.pageIdx !== undefined) prevFilter.pageIdx = 0
            return { ...prevFilter, ...filterBy }
        })
    }

    function onResetCookie() {
        bugService.resetCookie()
            .then(() => setVisitedBugs(''))
            .catch(err => showErrorMsg(' Fail to remove Cookie ', err))
    }

    function onAddLabel(bug, ev) {
        const addLabel = ev.target.value
        if (bug.labels.includes(addLabel)) return
        bug.labels.push(addLabel)
        const bugIdx = bugs.findIndex(curBug => curBug._id === bug._id)
        const updatedBugs = [...bugs]
        updatedBugs.splice(bugIdx, 1, bug)
        bugService.save(bug)
            .then(() => {
                setBugs(updatedBugs)
                showSuccessMsg('add Bug labels')
            })
            .catch(err => showErrorMsg('problem adding bug label', err))
    }

    function onRemoveLabel(bug, labelToRemove) {
        const labelIdx = bug.labels.findIndex(label => label === labelToRemove)
        bug.labels.splice(labelIdx, 1)
        const bugIdx = bugs.findIndex(curBug => curBug._id === bug._id)
        const updatedBugs = [...bugs]
        updatedBugs[bugIdx] = bug
        bugService.save(bug)
            .then(() => {
                setBugs(updatedBugs)
                showSuccessMsg('removed Bug labels')
            })
            .catch(err => showErrorMsg('problem removing bug label', err))
    }

    // function onSetVisitedBugs() {
    //     bugService.getVisitedBugs()
    //         .then(res => setVisitedBugs(res))
    //         .catch(err => showErrorMsg(' Failed fetching bugs from Server'))
    // }

    function togglePagination() {
        setFilterBy(prevFilter => {
            return {
                ...prevFilter,
                pageIdx: (prevFilter.pageIdx === undefined) ? 0 : undefined
            }
        })
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        setFilterBy(prevFilter => {
            let nextPage = prevFilter.pageIdx + diff
            if (nextPage < 0) nextPage = 0
            return { ...prevFilter, pageIdx: nextPage }
        })

    }

    const sumOfVisitedBugs = visitedBugs ? visitedBugs.length : 0

    return <section className="bug-index main-content">
        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <a href={`/bugs.pdf`} download>Download file</a>
            {/* { The first solution I found was using the function onDownloadPDF. Later I came to the
             sense that maybe using the A tag would be a better practice But it made me Create The
              document every time, so it will be ready for the egg tag to pass it on} */}
            {/* <button onClick={() => bugService.onDownloadPDF(filterBy)}>Download PDF</button> */}
            <button onClick={onResetCookie}>{sumOfVisitedBugs}</button>
            <button onClick={onAddBug}>Add Bug</button>
            <section>
                <button onClick={togglePagination}>Toggle Pagination</button>
                <button onClick={() => onChangePage(-1)}>-</button>
                <span>{(filterBy.pageIdx === undefined) ? 'No pagination' : ' pagination'}</span>
                <button onClick={() => onChangePage(1)}>+</button>

            </section>
        </header>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug}
            onAddLabel={onAddLabel}
            onRemoveLabel={onRemoveLabel}
        />
    </section>
}
