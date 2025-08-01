const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.remote.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => setBug(bug))
            .catch(err => showErrorMsg(`Cannot load bug`, err))
    }, [])
    const seenLimit = (bug === 'no bug') ? true : false

    return <div className="bug-details">
        <h3>Bug Details</h3>
        {!bug && <p className="loading">Loading....</p>}
        {seenLimit && <p className="loading"> You've reached the limit of views. Press on the number-of-views button to restart </p>}
        {
            bug && !seenLimit &&
            <div>
                <h4>{bug.title}</h4>
                <h5>Severity: <span>{bug.severity}</span></h5>
                <h5 className="description">Description :{bug.description}</h5>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam esse facilis vitae numquam architecto mollitia fugiat culpa minima aperiam amet sapiente, voluptate sit, in nemo ea. Expedita iure tempore explicabo?</p>
            </div>
        }
        <hr />
        <Link to="/bug">Back to List</Link>
    </div>

}