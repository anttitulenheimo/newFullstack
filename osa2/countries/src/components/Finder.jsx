const Finder = ({filter, handleFilterChange}) => {

    return (
        <form>
            <div>
                find countries <input value={filter} onChange={handleFilterChange}></input>
            </div>
        </form>
    )
}

export default Finder