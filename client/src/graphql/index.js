import { graphql } from 'react-apollo';
import * as R from 'ramda';
import ACTIONS from '../constants';
import {
  TODOS_QUERY,
} from './query';
import {
  CREATE_TODO_MUTATION,
  EDIT_TODO_MUTATION,
  TOGGLE_TODO_MUTATION,
  TOGGLE_ALL_MUTATION,
  DELETE_TODOS_MUTATION,
} from './mutation'
import {
  TODO_SUBSCRIPTION,
} from './subscription'

export const withTodos = graphql(TODOS_QUERY, {
  alias: 'withTodos',
  props: ({ data }) => ({
    todos: data,
    subscribeTodoChanged: clientID =>
      data.subscribeToMore({
        document: TODO_SUBSCRIPTION,
        variables: { filter: clientID },
        updateQuery: (
          { todos },
          {
            subscriptionData: {
              errors,
              data: { todoChanged: { payload, type } },
            },
          },
        ) => {
          if (errors) console.log({ errors });

          // Remind: this is a reducer by type
          switch (type) {
            case ACTIONS.CREATE: {
              const index = R.findIndex(R.propEq('id', payload[0].id))(todos);
              if (index === -1) {
                return { todos: R.prepend(payload[0])(todos) };
              }
              console.log('[ACTIONS.CREATE] duplicated key?');
              return { todos };
            }
            case ACTIONS.UPDATE: {
              const index = R.findIndex(R.propEq('id', payload[0].id))(todos);
              return { todos: R.adjust(R.merge(R.__, payload), index)(todos) };
            }
            case ACTIONS.DELETE: {
              const ids = R.pluck('id')(payload);
              return { todos: R.filter(todo => !ids.includes(todo.id))(todos) };
            }
            case ACTIONS.TOGGLE_ALL: {
              const { complete } = payload[0];
              // const index = R.findIndex(R.propEq('id', payload[0].id))(todos);
              const setItem = R.set(R.lensProp('complete'), complete);

              return { todos: R.map(setItem)(todos) };
            }
            default:
              return todos;
          }
        },
      }),
  }),
});

/**
 * Create HOC
 */
export const withCreateTodo = graphql(CREATE_TODO_MUTATION, {
  alias: 'withCreateTodo',
  props: ({ mutate }) => ({
    createTodo: ({ title }) =>
      mutate({
        variables: { title },
        optimisticResponse: {
          __typename: 'Mutation',
          createTodo: {
            __typename: 'Todo',
            title,
          },
        },
        update: (proxy, { data: { createTodo } }) => {
          const prevState = proxy.readQuery({ query: TODOS_QUERY });
          const lens = R.lensProp('todos');
          const data = R.over(lens, R.prepend(createTodo))(prevState);
          proxy.writeQuery({ query: TODOS_QUERY, data });
        },
      }),
  }),
});

/**
 * Edit HOC
 */
export const withEditTodo = graphql(EDIT_TODO_MUTATION, {
  alias: 'withEditTodo',
  props: ({ mutate }) => ({
    editTodo: ({ id, title }) =>
      mutate({
        variables: { id, title },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTodo: {
            __typename: 'Todo',
            id,
            title,
          },
        },
      }),
  }),
});

/**
 * Toggle HOC
 */
export const withToggleTodo = graphql(TOGGLE_TODO_MUTATION, {
  alias: 'withToggleTodo',
  props: ({ mutate }) => ({
    toggleTodo: ({ id, complete }) =>
      mutate({
        variables: { id, complete },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTodo: {
            __typename: 'Todo',
            id,
            complete,
          },
        },
      }),
  }),
});

/**
 * Toggle HOC
 */
export const withToggleAll = graphql(TOGGLE_ALL_MUTATION, {
  alias: 'withToggleAll',
  props: ({ mutate }) => ({
    toggleAll: complete =>
      mutate({
        variables: { complete },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleAll: {
            __typename: 'Todo',
            complete,
          },
        },
        update: (proxy, { data: { toggleAll } }) => {
          const prevState = proxy.readQuery({ query: TODOS_QUERY });
          const setItem = R.set(R.lensProp('complete'), toggleAll.complete);
          const data = R.evolve({ todos: R.map(setItem) })(prevState);
          proxy.writeQuery({ query: TODOS_QUERY, data });
        },
      }),
  }),
});

/**
 * Delete HOC
 */
export const withDeleteTodos = graphql(
  DELETE_TODOS_MUTATION,
  {
    alias: 'withDeleteTodos',
    props: ({ mutate }) => ({
      deleteTodos: todos => {
        const ids = R.pluck('id')(todos);

        return mutate({
          variables: { ids },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteTodos: ids,
          },
          update: (proxy, { data: { deleteTodos } }) => {
            const prevState = proxy.readQuery({ query: TODOS_QUERY });
            const lens = R.lensProp('todos');
            const filter = R.filter(todo => !deleteTodos.includes(todo.id));
            const data = R.over(lens, filter)(prevState);
            proxy.writeQuery({ query: TODOS_QUERY, data });
          },
        });
      },
    }),
  },
);
