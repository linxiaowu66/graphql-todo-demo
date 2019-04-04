import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
// 因为apollo-boost不支持subscription的配置，所以只能只用另外一种方式
// import ApolloClient from 'apollo-boost';
import ApolloClient from "apollo-client";
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import uuid from 'uuid/v4'

import * as serviceWorker from './serviceWorker';
// cra now is not support absolute path config in the tsconfig.json(https://github.com/facebook/create-react-app/issues/5645)
import App from './pages/App';

import './index.css';

const GW_BASE_URL = 'http://127.0.0.1:4000/graphql';
const GW_WS_URL = 'ws://127.0.0.1:4000/subscriptions'
const CLIENT_ID = 'Linxiaowu66-Client-ID'

function createClientID() {
  const clientID = uuid();
  window.localStorage.setItem(CLIENT_ID, clientID);
  return clientID;
}

const wsLink = new WebSocketLink({
  uri: GW_WS_URL,
  options: {
    reconnect: true
  }
});
const httpLink = new HttpLink({
  uri: GW_BASE_URL,
  credentials: 'same-origin',
  headers: {
    'Linxiaowu66-Client-ID': createClientID(),
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
