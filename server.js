require('dotenv').config();
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";

const PORT = process.env.PORT;

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            return {
                loggedInUser: await getUser(req.headers.token),
                protectResolver,
            };
        }
    });

    await server.start();
    const app = express();
    app.use(graphqlUploadExpress());
    server.applyMiddleware({app});

    await new Promise((func) => app.listen({ port: PORT }, func));
    
    console.log(`🚀 Server: http://localhost:${PORT}${server.graphqlPath}`);
}

startServer();