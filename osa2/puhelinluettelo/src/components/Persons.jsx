const Persons = ({personsToShow, handleDelete}) => {
    return (
        <div>
            {personsToShow.map(person =>
              <div
                  key={person.name}>{person.name} {person.number} {' '}
                  <button onClick={() => handleDelete({name: person.name, id: person.id})}>delete</button>
              </div>
            )}
        </div>
    )
}
export default Persons