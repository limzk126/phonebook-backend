require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [];

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

  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((res) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((result) => {
    console.log("POST RES", result);
    response.send(result);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
