const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>The server is running.</h1>");
});

app.get("/api/persons/:id?", (request, response) => {
  const id = Number(request.params.id);
  if (id) {
    const person = persons.find((person) => person.id === id);
    if (person) {
      return response.json(person);
    }

    return response.send(`Person with id ${id} does not exists!`);
  }

  response.json(persons);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);
  if (person) {
    persons = persons.filter((person) => person.id !== id);
    return response.send(`${person.name} has been deleted.`);
  }

  response.send(`Person with id ${request.params.id} does not exist!`);
});

app.get("/info", (request, response) => {
  const text = `<p>Phonebook has info for ${
    persons.length
  } people</p><p>${new Date().toString()}</p>`;
  response.send(text);
});

const PORT = 3001;
app.listen(PORT);
