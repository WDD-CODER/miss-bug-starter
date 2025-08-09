const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug, onAddLabel, onRemoveLabel, loggedinUser }) {


    function canUpdate(bug) {
        if (!bug.creator) return true
        if (loggedinUser && loggedinUser._id === bug.creator._id) return true
        // if (loggedinUser.isAdmin) return true
        else return false
    }

    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => {
            return (<li key={bug._id}>
                <BugPreview bug={bug} />
                {canUpdate(bug) && <React.Fragment>

                    <label className="actions" htmlFor="labels" onChange={ev => onAddLabel(bug, ev)}>
                        Label:
                        <select name="labels" id="labels">
                            <option value="">Choose Label</option>
                            <option value="critical">Critical</option>
                            <option value="need-CR">Need CR</option>
                            <option value="dev-branch">Dev Branch</option>
                        </select>
                    </label>

                    <section className="actions">
                        <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                        <button onClick={() => onEditBug(bug)}>Edit</button>
                        <button onClick={() => onRemoveBug(bug._id)}>x</button>
                    </section>
                </React.Fragment>
                }

                <section className="labels" style={{ pointerEvents:  canUpdate(bug) ? 'auto' : 'none' }}>
                    {bug.labels.length > 0 &&
                        bug.labels.map(label => <button key={label} onClick={() => onRemoveLabel(bug, label)}>{label}</button>)}
                </section>

            </li>);
        })}
    </ul>
}
