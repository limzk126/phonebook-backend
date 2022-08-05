const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token("body", (req)  => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

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

app.get("/info", (request, response) => {
  const text = `<p>Phonebook has info for ${
    persons.length
  } people</p><p>${new Date().toString()}</p>`;
  response.send(text);
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

  console.log("persons ...", persons);
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

const generateId = () => {
  return Math.floor(Math.random() * Number.MAX_VALUE);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  if (
    persons.find(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  response.send(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
