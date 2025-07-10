import { useState, useEffect } from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import personService from "./services/personService.js";

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState('')


  useEffect(() => {
      personService.getAll()
          .then(initialPersons => {
              setPersons(initialPersons)
          })
  }, [])


  const addPerson = (event) => {
      event.preventDefault()
      const possiblePerson = persons.find(person => person.name === newName)
      if (possiblePerson) {
          if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
              const updatedPerson = {...possiblePerson, number: newNumber}
              personService.update(updatedPerson.id, updatedPerson)
               .then((returnedPerson) => { // Updates without a refresh
                setPersons(persons.map(person => person.id !== possiblePerson.id ? person : returnedPerson))
                setNewName('')
                setNewNumber('')
          })
          }
      }
      else {
      const personObject = {
          name: newName,
          number: newNumber
      }
      personService.create(personObject)
          .then(returnedPerson => {
              setPersons(persons.concat(returnedPerson))
              setNewName('')
              setNewNumber('')
          })
  }
  }

  const handleDelete = ({name, id}) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.deleteDocument(id)
          .then(() => { // Updates without a refresh
              setPersons(persons.filter(person => person.id !== id))
          })
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
        <Persons personsToShow={personsToShow} handleDelete={handleDelete}></Persons>
    </div>
  )

}

export default App