import { useState } from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState('')

  const addPerson = (event) => {
      event.preventDefault()
      if (persons.some(person => person.name === newName)) {
          alert(`${newName} is already added to phonebook`)
      }
      else {
      const personObject = {
          name: newName,
          number: newNumber
      }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
  }
  }

  const handleNameChange = (event) => {
      console.log(event.target.value)
      setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
      console.log(event.target.value)
      setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
      console.log(event.target.value)
      setShowFiltered(event.target.value)
  }

  // String is a condition in JS!!!
  const personsToShow = showFiltered
    ? persons.filter(person =>
      person.name.toLowerCase().includes(showFiltered.toLowerCase()))
    : persons


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter showFiltered={showFiltered} handleFilterChange={handleFilterChange}></Filter>
      <h3>add a new</h3>
      <PersonForm
          addPerson={addPerson}
          newName={newName}
          handleNameChange={handleNameChange}
          newNumber={newNumber}
          handleNumberChange={handleNumberChange}>
      </PersonForm>
      <h3>Numbers</h3>
        <Persons personsToShow={personsToShow}></Persons>
    </div>
  )

}

export default App