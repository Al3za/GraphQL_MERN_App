import mongoose, { ObjectId } from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { GraphQLError } from 'graphql';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { User as UserModel } from './models/user.js';
import Users from './dataSources/users.js';
import pkg from 'body-parser';
import { UserDocument } from './types.js';
const { json } = pkg;

await mongoose.connect('mongodb://127.0.0.1:27017/ragnemt');

const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const typeDefs = `#graphql
  type User {
    _id: ID! #mark (!) means that our server always expects to return a non-null value for this field
    username: String
    password: String
    email: String
  }
  type Query {
    users: [User]
    user(_id: ID!): User
  }
  type Mutation {
    addUser(username: String, password: String, email: String): User
  }
`;

const resolvers = {
    Query: {
        users: (_parent: any, _args: any, { dataSourses }) => {
            //dataSourses = ContextValue
            // console.log(dataSourses.token, 'dataSourses.token')
            return dataSourses.users.getUsers();
        },
        user: (_parent: any, { _id }, { dataSourses }) => {
            return dataSourses.users.getUser(_id)
                .then((res: UserDocument) => {
                    if (!res) {
                        throw new GraphQLError(
                            `User with User Id ${_id} does not exist.`
                            // this error ll be thrown in our react app UI
                        );
                    }
                    return res;
                });
        },
    },
    Mutation: {
        addUser: (_parent: any, { username, password, email }, { dataSourses }) => {
            return dataSourses.users.addUser(username, password, email)
                .then((res: { insertedIds: ObjectId[]; }) => (
                    { _id: res.insertedIds[0], username, password, email }
                ))
        }
    }

}

interface MyContext {
    dataSourses?: {
        token: String
        users: Users;
    }; // seems like the object name and property name doesnt have to match
}

const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [
        // Proper/gracefully shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),
        //When all of your requests to the server have received a response and there is no remaining data processing work to be done.
    ],
});
await server.start();
// Apollo Server provides the backend GraphQL API, 
// while Apollo Client handles the frontend data fetching and state management.
// This combination allows for efficient, declarative data fetching and a smooth developer experience.

const mockLoginUser = {
    //_id: '', // we use id: to mock data but in real case we have to use _id and pass not a string but a new ObjectId
    // for exemple if we fetch a user from mongoDB;
    mockId: 'testes',
    username: '',
    password: '',
    email: '',
};

app.use(
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, { // expressMiddleware attach apollo server to express server, and adds features like cors and middleware
        context: async ({ req }) => {
            const loggedInUser = mockLoginUser; // we mock the current user data and pass it to the dataSource do some user verification
            req.headers.token = 'gschgagasdagghd'
            const tok = req.headers.token;
            //console.log(req.headers.token, 'token')
            return {
                dataSourses: {
                    token: req.headers.token,
                    users: new Users({ modelOrCollection: await UserModel.createCollection(), loggedInUser, tok })
                },
            }
        },
    }),
);

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`))