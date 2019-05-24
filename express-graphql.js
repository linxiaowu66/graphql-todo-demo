const express = require('express');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag')
const { makeExecutableSchema } = require('graphql-tools')
const { buildSchema } = require('graphql');

const fakeDatabase = [{
  id: 0,
  content: 'test content',
  author: 'pp'
}, {
  id: 1,
  content: 'test content 1',
  author: 'pp1'
}];

// 很多人都疑惑：gql和buildSchema有何区别？答案是
// gql只是使用graphql-js包的parse函数去解析一段GraphQL语法生成document，
// 而buildSchema不仅使用parse函数生成document，他还会对document进行再次解析生成GraphQLSchema实例，二者是不一样的因此不可互相替代。


// Construct a schema, using GraphQL schema language
// const schema = buildSchema(`
//   input MessageInput {
//     content: String
//     author: String
//   }

//   """消息列表"""
//   type Message {
//     """文章ID"""
//     id: ID!
//     """文章内容"""
//     content: String
//     """作者"""
//     author: String
//     """废弃的字段"""
//     oldField: String @deprecated(reason: "Use \`newField\`.")
//   }
//   """支持的查询方法"""
//   type Query {
//     """获取消息"""
//     getMessage("""消息ID"""id: ID): [Message]
//   }
//   type Mutation {
//     createMessage(input: MessageInput): Message
//     updateMessage(id: ID!, input: MessageInput): Message
//   }
// `);

// // The root provides a resolver function for each API endpoint
// const root = {
//   getMessage: (param) => {
//     console.log('->>>>>>>>>>>', param)
//     const { id } = param
//     if (!id) {
//       return fakeDatabase
//     }
//     if (!fakeDatabase[id]) {
//       throw new Error('no message exists with id ' + id);
//     }
//     return [fakeDatabase[id]]
//   },
//   createMessage: function ({input}) {
//     // Create a random id for our "database".
//     var id = require('crypto').randomBytes(10).toString('hex')
//     fakeDatabase.push({ id, ...input });

//     return fakeDatabase[fakeDatabase.length - 1]
//   },
//   updateMessage: function({id, input}) {
//     if (!fakeDatabase[id]) {
//       throw new Error('no message exists with id ' + id);
//     }
//     const newInput = { ...fakeDatabase[id], ...input }
//     // This replaces all old data, but some apps might want partial update.
//     fakeDatabase[id] = newInput;
//     return newInput
//   }
// };

// 第二种写法，不需要rootValue的情况下，直接将resolve函数附着到schema上，具体原理在文章中会提到

const typeDefs = `
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
`
const resolvers = {
  Query: {
    getMessage: (source, param) => { // 这种写法的入参和第一种写法不一样！！！
      const { id } = param
      if (!id) {
        return fakeDatabase
      }
      if (!fakeDatabase[id]) {
        throw new Error('no message exists with id ' + id);
      }
      return [fakeDatabase[id]]
    },
  }
}
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})


const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  // rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
