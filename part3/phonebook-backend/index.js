const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', function (request, response) {return JSON.stringify(request.body)})

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person)
    response.json(person)
  response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  if (!(request.body.name && request.body.number)) {
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  }

  if (persons.find(person => person.name === request.body.name)) {
    return response.status(400).json({
      error: 'The name already exists in the phonebook'
    })
  }

  const newPerson = { id: generateRandomId(), name: request.body.name, number: request.body.number }
  persons = persons.concat(newPerson)
  return response.json(persons)
})

app.get('/info', (request, response) => {
  let body = ''
  body = body.concat(`<div>Phonebook has info for ${persons.length} people</div>`)
  body = body.concat('<br/>')
  body = body.concat(`<div>${new Date()}</div>`)
  // console.log(body)
  response.send(body)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const generateRandomId = () => {
  const existingIds = [...persons.map(person => person.id)]
  let id = Math.floor(Math.random() * 10000)
  while (existingIds.includes(id)) {
    id = Math.floor(Math.random() * 10000)
  }
  return id
}