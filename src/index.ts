import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from 'express-session';
import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver]
  });

  const app = Express();

  app.use(session({
    secret: "cat",
    name: "qid",
    resave: false,
    saveUninitialized: false,
  }))

  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }))
  const apolloServer = new ApolloServer({ schema, context: ({ req }: any) => ({ req }) });


  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server listening on http://localhost:4000/graphql")
  })
}

main();