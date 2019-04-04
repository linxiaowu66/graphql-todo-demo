import gql from 'graphql-tag';

export const CREATE_TODO_MUTATION = gql`
  mutation createTodoMutation($title: String!) {
    createTodo(title: $title) {
      id
      title
      complete
    }
  }
`;

export const EDIT_TODO_MUTATION = gql`
  mutation editTodoMutation($id: ID!, $title: String!) {
    updateTodo(payload: { id: $id, title: $title }) {
      id
      title
    }
  }
`;

export const TOGGLE_TODO_MUTATION = gql`
  mutation toggleTodoMutation($id: ID!, $complete: Boolean!) {
    updateTodo(payload: { id: $id, complete: $complete }) {
      id
      complete
    }
  }
`;

export const TOGGLE_ALL_MUTATION = gql`
  mutation toggleAllMutation($complete: Boolean!) {
    toggleAll(complete: $complete) {
      complete
    }
  }
`;

export const DELETE_TODOS_MUTATION = gql`
  mutation deleteTodosMutation($ids: [ID]!) {
    deleteTodos(ids: $ids)
  }
`;
