const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(morgan('tiny'))

app.use(express.json())

morgan.token('data', req => { // Own custom token for the POST
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

// Own custom format to log
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))



let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
  ]

app.get('/api/persons/', (request, response) => {
    response.json(persons)
})


app.get('/info/', (request, response) => {
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date().toString()}</p>
        </div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({error: 'name missing'})
    }

    if (!body.number) {
        return response.status(400).json({error: 'number missing'})
    }


    const person = {
        id: idGenerator(),
        name: body.name,
        number: body.number
    }

    if (persons.find(otherPerson => person.name === otherPerson.name )) {
        return response.status(400).json({error: 'name must be unique'})
    }

    persons = persons.concat(person)

    response.json(person)

})

const idGenerator = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(x => Number(x.id))) : 0
  return String(maxId + 1)
}


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
