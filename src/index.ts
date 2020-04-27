import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import express from "express";
import { execute, subscribe } from "graphql";
import { ApolloServer, PubSub } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import connectionOptions from "./ormConfig";
import http from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
const PORT: number | string = process.env.PORT || 4000;

(async () => {
  const app = express();
  const pubSub = new PubSub();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/resolvers/**/*.ts"],
    }),
    context: (req) => {
      return { req, pubSub: pubSub };
    },
    subscriptions: {
      path: "/subscriptions",
      onConnect: async (connectionParams) => console.log(connectionParams),
    },
  });
  app.use(logger("dev"));
  app.use(cors());
  app.use(helmet());
  apolloServer.applyMiddleware({ app, path: "/" });

  try {
    await createConnection(connectionOptions);
    const httpServer = http.createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);

    httpServer.listen(PORT, async () => {
      console.log(`Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
      console.log(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`);
    });
  } catch (e) {
    console.log(e);
  }
})();
