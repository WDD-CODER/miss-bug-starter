const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug, onAddLabel, onRemoveLabel }) {

    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <label className="actions" htmlFor="labels" onChange={ev => onAddLabel(bug, ev)}>
                    Label:
                    <select name="labels" id="labels">
                        <option value="">Choose Label</option>
                        <option value="critical">Critical</option>
                        <option value="need-CR">Need CR</option>
                        <option value="dev-branch">Dev Branch</option>
                    </select>
                </label>

                <section className="labels">
                    {bug.labels.length > 0 &&
                        bug.labels.map(label =>
                            <button key={label} onClick={() => onRemoveLabel(bug, label)}>{label}</button>
                        )}
                </section>

                <section className="actions">
                    <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                    <button onClick={() => onEditBug(bug)}>Edit</button>
                    <button onClick={() => onRemoveBug(bug._id)}>x</button>
                </section>
            </li>
        ))}
    </ul>
}
