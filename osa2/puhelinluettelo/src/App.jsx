import { useState, useEffect } from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import Notification from "./components/Notification.jsx";
import personService from "./services/personService.js";

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


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
              personService
               .update(updatedPerson.id, updatedPerson)
               .then((returnedPerson) => { // Updates without a refresh
                    setPersons(persons.map(person => person.id !== possiblePerson.id ? person : returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    setSuccessMessage(`${newName} number updated successfully`)
                    setTimeout(() => {setSuccessMessage(null)}, 5000) // Deletes the message
          })
               .catch(error => {
                    setErrorMessage(`Information of ${possiblePerson.name} has already been removed from server`)
                    setTimeout(() => {setErrorMessage(null)}, 5000)
                    setPersons(persons.filter(person => person.id !== possiblePerson.id))
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
              setSuccessMessage(`Added ${newName}`)
              setTimeout(() => {setSuccessMessage(null)}, 5000) // Deletes the message
          })
  }
  }

  const handleDelete = ({name, id}) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.deleteDocument(id)
          .then(() => { // Updates without a refresh
              setPersons(persons.filter(person => person.id !== id))
              setSuccessMessage(`Deleted ${name}`)
              setTimeout(() => {setSuccessMessage(null)}, 5000) // Deletes the message
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
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
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