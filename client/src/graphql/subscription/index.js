import gql from 'graphql-tag'

export const TODO_SUBSCRIPTION = gql`
  subscription todoSubscription($filter: String!) {
    todoChanged(filter: $filter) {
      type
      payload {
        id
        title
        complete
      }
    }
  }
`;
