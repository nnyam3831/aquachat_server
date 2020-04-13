import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import connectionOptions from "./ormConfig";
const PORT: number | string = process.env.PORT || 4000;

(async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/resolvers/**/*.ts"],
    }),
  });
  app.use(logger("dev"));
  app.use(cors());
  app.use(helmet());
  apolloServer.applyMiddleware({ app });

  try {
    await createConnection(connectionOptions);
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
})();
