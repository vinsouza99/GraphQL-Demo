import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = `
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
    person: Person
  }

  type Query {
    people: [Person]
    cars: [Car]
    person(id: ID!): Person
    car(id: ID!): Car
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    addCar(year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    updatePerson(id: ID!, firstName: String!, lastName: String!): Person
    updateCar(id: ID!, year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    deletePerson(id: ID!): Person
    deleteCar(id: ID!): Car
  }
`;
let peopleIdCount = 3;
let carIdCount = 9;
const people = [
  {
    id: "1",
    firstName: "Bill",
    lastName: "Gates",
  },
  {
    id: "2",
    firstName: "Steve",
    lastName: "Jobs",
  },
  {
    id: "3",
    firstName: "Linux",
    lastName: "Torvalds",
  },
];

const cars = [
  {
    id: "1",
    year: 2019,
    make: "Toyota",
    model: "Corolla",
    price: "40000",
    personId: "1",
  },
  {
    id: "2",
    year: 2018,
    make: "Lexus",
    model: "LX 600",
    price: "13000",
    personId: "1",
  },
  {
    id: "3",
    year: 2017,
    make: "Honda",
    model: "Civic",
    price: "20000",
    personId: "1",
  },
  {
    id: "4",
    year: 2019,
    make: "Acura ",
    model: "MDX",
    price: "60000",
    personId: "2",
  },
  {
    id: "5",
    year: 2018,
    make: "Ford",
    model: "Focus",
    price: "35000",
    personId: "2",
  },
  {
    id: "6",
    year: 2017,
    make: "Honda",
    model: "Pilot",
    price: "45000",
    personId: "2",
  },
  {
    id: "7",
    year: 2019,
    make: "Volkswagen",
    model: "Golf",
    price: "40000",
    personId: "3",
  },
  {
    id: "8",
    year: 2018,
    make: "Kia",
    model: "Sorento",
    price: "45000",
    personId: "3",
  },
  {
    id: "9",
    year: 2017,
    make: "Volvo",
    model: "XC40",
    price: "55000",
    personId: "3",
  },
];

const resolvers = {
  Query: {
    people: () => people,
    cars: () => cars,
    person: (_, { id }) => people.find((person) => person.id === id),
    car: (_, { id }) => cars.find((car) => car.id === id),
  },

  Person: {
    cars: (parent) => cars.filter((car) => car.personId === parent.id),
  },

  Car: {
    person: (parent) => people.find((person) => person.id === parent.personId),
  },

  Mutation: {
    addPerson: (_, { firstName, lastName }) => {
      const person = { id: `${++peopleIdCount}`, firstName, lastName };
      people.push(person);
      return person;
    },
    addCar: (_, { year, make, model, price, personId }) => {
      const car = {
        id: `${++carIdCount}`,
        year,
        make,
        model,
        price: String(price),
        personId,
      };
      cars.push(car);
      return car;
    },
    updatePerson: (_, { id, firstName, lastName }) => {
      const personIndex = people.findIndex((person) => person.id === id);

      if (personIndex === -1) {
        throw new Error(`Person with id ${id} not found`);
      }

      const updatedPerson = {
        id,
        firstName,
        lastName,
      };
      people[personIndex] = updatedPerson;
      return updatedPerson;
    },
    updateCar: (_, { id, year, make, model, price, personId }) => {
      // Find the car index in your cars array
      const carIndex = cars.findIndex((car) => car.id === id);

      // If car not found, return null or throw an error
      if (carIndex === -1) {
        throw new Error(`Car with id ${id} not found`);
      }

      const updatedCar = {
        id,
        year,
        make,
        model,
        price: String(price),
        personId,
      };
      cars[carIndex] = updatedCar;
      return updatedCar;
    },
    deletePerson: (_, { id }) => {
      const personIndex = people.findIndex((person) => person.id === id);
      if (personIndex === -1) return null;

      const [deletedPerson] = people.splice(personIndex, 1);

      const carsToKeep = cars.filter((car) => car.personId !== id);
      cars.length = 0;
      cars.push(...carsToKeep);
      return deletedPerson;
    },
    deleteCar: (_, { id }) => {
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex === -1) return null;

      const [deletedCar] = cars.splice(carIndex, 1);
      return deletedCar;
    },
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });
