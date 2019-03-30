const mongo = require('mongoose')
const path = require('path')
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const express = require('express');
const { execute, subscribe } = require('graphql');
const { server } = require('./apollo-config')
const { schema } = require('./graphql')
require('./env')

const app = express()

server.applyMiddleware({ app })

app.use(express.static(path.join(__dirname, '../client/build'), { maxAge: 86400000 }));

// Create webSocketServer
const ws = createServer(app)

// Configure params for mongoConnection
const options = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }

mongo.connect(process.env.URI, options).then(() => {
  // If connected, then start server

  ws.listen(process.env.PORT, () => {
    console.log('Server on port', process.env.PORT)
    console.log('Mongo on port: ', process.env.DBPORT)

    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
      server: ws,
      path: '/subscriptions',
    });
  });

}).catch(err => {
  console.log(err)
})
