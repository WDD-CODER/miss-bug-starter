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

    function labelsOptions() {

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
                <label htmlFor="sortDir" > Descending
                    <input type="checkbox" name="sortDir" id="sortDir" value="-1" onClick={handleChange} />
                </label>

                <label className="sortBy" htmlFor="sortBy" >Sorting By:</label>
                    <select name="sortBy" id="sortBy" onChange={handleChange}>
                        <option value="title">Title</option>
                        <option value="severity">Severity</option>
                        <option value="createdAt">CreatedAt</option>
                    </select>
                    
                <br />
                
                    <label className="label" htmlFor="label" onChange={handleChange}> Filter by Label:</label>
                        <select onChange={handleChange} id="label" name="label">
                            <option value="">Select Label</option>
                            <option value="critical">critical</option>
                            <option value="dev-branch">dev-branch</option>
                            <option value="need-CR">need-CR</option>
                        </select>
                    
              


            </form>
        </section>
    )
}