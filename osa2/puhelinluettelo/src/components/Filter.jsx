const Filter = ({showFiltered, handleFilterChange}) => {
    return(
    <div>
        filter shown with <input value={showFiltered} onChange={handleFilterChange}/>
    </div>
    )
}
export default Filter