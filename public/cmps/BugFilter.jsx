const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                if (field === 'sortDir') {
                    value = (value) ? -1 : 1
                }
                break

            default:
                break
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <label className="sortBy" htmlFor="sortBy" onChange={handleChange}> Set Sorting By:
                    <select name="sortBy" id="sortBy">
                        <option value="title">Title</option>
                        <option value="severity">Severity</option>
                        <option value="createdAt">CreatedAt</option>
                    </select>
                </label>
                <label htmlFor="sortDir" > Descending
                    <input type="checkbox" name="sortDir" id="sortDir" value="-1" onClick={handleChange} />
                </label>

            </form>
        </section>
    )
}