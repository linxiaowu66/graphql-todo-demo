const {
  ApolloServer
} = require('apollo-server-express')
const {
  PubSub,
} = require('graphql-subscriptions')
const R = require('ramda')
const { schema } = require('./graphql')
const { todolist } = require('./models/TodoList')

const CLIENT_ID = 'linxiaowu66-client-id'

const server = new ApolloServer({
  schema,
  context({
    req
  }) {
    return {
      models: { todolist },
      clientID: R.path(['headers', CLIENT_ID])(req),
    }
  },
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light'
    },
    subscriptionEndpoint: 'ws://localhost:4000/subscriptions'
  }
})

exports.server = server
