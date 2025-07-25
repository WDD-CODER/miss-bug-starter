const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                    <button onClick={() => onEditBug(bug)}>Edit</button>
                    <button onClick={() => onRemoveBug(bug._id)}>x</button>
                </section>
            </li>
        ))}
    </ul >
}
