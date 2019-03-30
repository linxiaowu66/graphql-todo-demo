const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const fakeDatabase = [];

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }
  type Query {
    getMessage(id: ID): [Message]
  }
  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  getMessage: ({id}) => {
    console.log(id)
    if (!id) {
      return fakeDatabase
    }
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return [fakeDatabase[id]]
  },
  createMessage: function ({input}) {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex')
    fakeDatabase.push({ id, ...input });

    return fakeDatabase[fakeDatabase.length - 1]
  },
  updateMessage: function({id, input}) {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    const newInput = { ...fakeDatabase[id], ...input }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = newInput;
    return newInput
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
