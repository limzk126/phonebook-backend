const mongoose = require('mongoose');

if (process.argv.length < 3) {
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.gucromj.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model('Person', personSchema);

const newName = process.argv[3];
const newNumber = process.argv[4];

const addPerson = () => {
  const person = new Person({
    name: newName,
    number: newNumber,
  });

  return person.save().then(() => {
    console.log(`added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close();
  });
};

const getPeople = () => {
  console.log('Phonebook:');
  return Person.find({}).then((result) => {
    result.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
};

if (newName && newNumber) {
  addPerson().catch((err) => console.log(err));
} else {
  getPeople().catch((err) => console.log(err));
}
