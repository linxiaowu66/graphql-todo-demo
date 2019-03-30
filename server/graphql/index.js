const { makeExecutableSchema } = require('graphql-tools')
const { fileLoader, mergeResolvers, mergeTypes } = require('merge-graphql-schemas')
const path = require('path')

const resolversArray = fileLoader(path.join(__dirname, './resolvers/'), { recursive: true, extensions: ['.js'] });
const typesArray = fileLoader(path.join(__dirname, './types/'), { recursive: true, extensions: ['.gql'] });
const resolvers = mergeResolvers(resolversArray);
const typeDefs = mergeTypes(typesArray, {all: true});
const schema = makeExecutableSchema({ typeDefs, resolvers });

exports.schema = schema
