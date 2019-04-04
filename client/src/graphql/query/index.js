import gql from 'graphql-tag';

export const TODOS_QUERY = gql`
  query todosQuery {
    todos {
      id
      title
      complete
    }
  }
`;
