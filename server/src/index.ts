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
import Jwt from 'jsonwebtoken';
const { json } = pkg;
import dotenv from 'dotenv';
dotenv.config();
const checkEnv = process.env.JWT_SECRET;

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
    roles:String! #Submission error! $Cannot return null for non - nullable field User.roles. error message you get if
    # you dont send any roles from client side addUser component 
    email: String
  }

   type UserToken { #id: String,
        token: String
    }

  type Query { 
  UserLogin(username:String,password:String): UserToken
   # UserLogin(username: UserLoginInput): UserToken
    users: [User]
    user(_id: ID!): User
  }

  type Mutation {
    addUser(username: String, password: String, email: String, roles:[String]): User # roles has to be an array
  }
`
interface JwtPayload {
    userRole: JwtPayload | string
}
const verifyJwt = (JwtToken: string | null) => {
    // verify token here;
    if (JwtToken) {
        try {
            const { userRole } = Jwt.verify(JwtToken, process.env.JWT_SECRET) as JwtPayload;
            //console.log(verify, 'verify one', typeof verify, 'verify') // Jwt type is object
            return { userRole };
        } catch (error) {
            // console.log(error, 'erroress')
            return;
            // JsonWebTokenError: invalid signature
            // The error you get when a JWT is wrong writter or expired
        }

    }
}
const resolvers = {
    Query: {
        users: (_parent: any, _args: any, { dataSourses }) => {
            const JwtVerify = verifyJwt(dataSourses.Usertoken);
            if (!JwtVerify) throw new GraphQLError('Not authenticated, please log in again');

            console.log(JwtVerify.userRole, 'JwtVerify.userRole')
            //dataSourses = ContextValue
            // console.log(dataSourses.token, 'dataSourses.token')
            return dataSourses.users.getUsers();
        },
        user: (_parent: any, { _id }, { dataSourses }) => {
            const JwtVerify = verifyJwt(dataSourses.Usertoken);
            if (!JwtVerify) throw new GraphQLError('Not authenticated, please log in again')
            console.log(JwtVerify, 'JwtVerify')
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
        UserLogin: (_parent: any, { username, password } /*String*/, { dataSourses }) => {

            return dataSourses.users.loginUser(username, password)
        },
    },
    Mutation: {
        addUser: (_parent: any, { username, password, email, roles }, { dataSourses }) => {
            const JwtVerify = verifyJwt(dataSourses.Usertoken)
            if (!JwtVerify) throw new GraphQLError('Not authenticated, please log in again')
            //const array = JwtVerify.userRole;
            if (JwtVerify.userRole[0] !== 'admin') throw new GraphQLError('Most be an admin to add a user')
            return dataSourses.users.addUser(username, password, email, roles)
                .then((res: { insertedIds: ObjectId[]; }) => (
                    { _id: res.insertedIds[0], username, password, email, roles }
                ))
        },

        //     UserLogin: (_parent: any, { username, password } /*String*/, { dataSourses }) => {

        //         return dataSourses.users.loginUser(username, password)

        //     },
    }

}

interface MyContext {
    dataSourses?: {
        token: String
        users: Users;
        MockurrentUserId: String | null;
        Usertoken: String | null
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
    roles: ['user', 'admin'],
    username: '',
    password: '',
    email: '',
};

app.use(
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, { // expressMiddleware attach apollo server to express server, and adds features like cors and middleware
        context: async ({ req }) => {
            // console.log(req.headers.authorization.split(" ")[1], 'token')
            const loggedInUser = mockLoginUser; // we mock the current user data and pass it to the dataSource do some user verification
            // req.headers.token = 'gschgagasdagghd'
            const tok = 'tokess';
            const MockurrentUserId = req.headers.authorization?.split(" ")[1];
            // const Usertoken: string | null = req.headers.authorization.split(" ")[1];
            //console.log(Usertoken, 'UserToken')
            // if (!verifyJwt(Usertoken)) throw new GraphQLError('Not Logged in');
            // here write middleware data to be passed our dataSource (Users)
            return {
                dataSourses: {
                    // here write middleware data to be pass in our resolvers
                    Usertoken: req.headers.authorization.split(" ")[1],
                    MockurrentUserId: req.headers.authorization?.split(" ")[1],
                    token: req.headers.token,
                    users: new Users({ modelOrCollection: await UserModel.createCollection(), loggedInUser, tok, MockurrentUserId })
                },
            }
        },
    }),
);

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`))