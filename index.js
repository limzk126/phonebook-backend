require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

app.get('/', (request, response) => {
  response.send('<h1>The server is running.</h1>');
});

app.get('/info', (request, response) => {
  Person.find({}).then((people) => {
    const text = `<p>Phonebook has info for ${
      people.length
    } people</p><p>${new Date().toString()}</p>`;
    response.send(text);
  });
});

app.get('/api/persons/:id?', (request, response, next) => {
  const { id } = request.params;
  if (id) {
    return Person.findById(id)
      .then((person) => response.json(person))
      .catch(next);
  }

  return Person.find({})
    .then((people) => {
      response.json(people);
    })
    .catch(next);
});

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(next);
});

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  Person.findByIdAndUpdate(id, request.body, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch(next);
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    });
  }

  if (
    Person.find({ name: { $regex: new RegExp(body.name.toLowerCase(), 'i') } })
  ) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  return newPerson
    .save()
    .then((result) => {
      response.send(result);
    })
    .catch(next);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
  console.log('Custom err handler called ...', error);

  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};

app.use(errorHandler);
