const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const serverless = require("serverless-http");
const { ObjectId } = require("mongodb");
const connectDB = require("./db.cjs");

const typeDefs = gql`
  input RequestInput {
    from: String
    text: String
    user: String
    message: String
    userName: String
    note: String
    isRead: Boolean
    requestedAt: String
    userId: String
    userPhone: String
    userEmail: String
  }

  type Request {
    from: String
    text: String
    user: String
    message: String
    userName: String
    note: String
    isRead: Boolean
    requestedAt: String
    userId: String
    userPhone: String
    userEmail: String
  }

  type Book {
    _id: ID!
    title: String
    author: String
    status: String
    intent: String
    description: String
    ownerId: String
    ownerName: String
    owner: String
    createdAt: String
    requests: [Request]
  }

  type Query {
    books(filter: String): [Book]
    book(id: ID!): Book
  }

  type Mutation {
    createBook(
      title: String!
      author: String!
      status: String
      intent: String
      description: String
      ownerId: String
      ownerName: String
    ): Book
    
    deleteBook(id: ID!): Boolean

    updateBook(
      id: ID!
      title: String
      author: String
      requests: [RequestInput]
    ): Book
  }
`;

const resolvers = {
  Query: {
    books: async (_, { filter }) => {
      const db = await connectDB();
      const collection = db.collection("books");
      
      const query = filter ? {
        $or: [
          { title: new RegExp(filter, "i") },
          { author: new RegExp(filter, "i") }
        ]
      } : {};

      return await collection.find(query).sort({ createdAt: -1 }).toArray();
    },
    book: async (_, { id }) => {
      const db = await connectDB();
      return await db.collection("books").findOne({ _id: new ObjectId(id) });
    }
  },
  Mutation: {
    createBook: async (_, args) => {
      const db = await connectDB();
      const newBook = {
        ...args,
        requests: [],
        createdAt: new Date().toISOString()
      };
      const result = await db.collection("books").insertOne(newBook);
      return { _id: result.insertedId, ...newBook };
    },
    deleteBook: async (_, { id }) => {
      const db = await connectDB();
      const result = await db.collection("books").deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    },
    updateBook: async (_, { id, title, author, requests }) => {
      const db = await connectDB();
      const collection = db.collection("books");
      
      let updateData = {};

  
      if (title) updateData.title = title;
      if (author) updateData.author = author;
      if (requests) updateData.requests = requests;

      if (Object.keys(updateData).length === 0) return null;

      await collection.updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updateData }
      );
      
      return await collection.findOne({ _id: new ObjectId(id) });
    },
  }
};

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
});

let serverHandler;

exports.handler = async (event, context) => {
  if (!serverHandler) {
    await server.start();
    server.applyMiddleware({ app, path: "/", cors: true });
    serverHandler = serverless(app);
  }

  event.path = event.path.replace("/.netlify/functions/graphql", "");
  if (event.path === "") event.path = "/";

  return serverHandler(event, context);
};