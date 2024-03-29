require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
morgan.token('data', function (request) { return JSON.stringify(request.body) })

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('build'))

// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(
    result => response.json(result)
  ).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person)
      response.json(person)
    else
      response.status(404).end()
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person)
      Person.findByIdAndDelete(request.params.id).then(
        () => {
          response.status(204).end()
        })
    else
      response.status(404).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  if (!(request.body.name && request.body.number)) {
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  }

  Person.findOne({ 'name': request.body.name }).then(result => {
    if (result) {
      console.log('Found duplicate')
      return response.status(400).json({
        error: 'The name already exists in the phonebook'
      })
    }
    const newPerson = new Person({
      name: request.body.name,
      number: request.body.number
    })
    newPerson.save().then(
      result => {
        return response.json(result)
      }).catch(error => next(error))
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const updatedPerson = {
    number: request.body.number
  }
  Person.findByIdAndUpdate(
    request.params.id,
    updatedPerson,
    { new: true, runValidators: true, context: 'query' })
    .then(
      result => {
        return response.json(result)
      }).catch(error => next(error))
})

app.get('/info', (request, response) => {
  let records = 0
  Person.find({}).then(result => {
    records = result.length
  })
  let body = ''
  body = body.concat(`<div>Phonebook has info for ${records} people</div>`)
  body = body.concat('<br/>')
  body = body.concat(`<div>${new Date()}</div>`)
  // console.log(body)
  response.send(body)
})

app.use(errorHandler)
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})