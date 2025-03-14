import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema.js";

const app = express();
app.use(cors());

const server = new ApolloServer({ schema });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
