const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const serverless = require("serverless-http");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const connectDB = require("./db.cjs");

const app = express();
const secretKey = process.env.JWT_SECRET;


const typeDefs = gql`
  input RequestInput {
    user: String
    message: String
    isRead: Boolean
    requestedAt: String
    userId: String
  }

  type Request {
    user: String
    message: String
    isRead: Boolean
    requestedAt: String
    userId: String
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
    createdAt: String
    requests: [Request]
  }

  type Query {
    books(filter: String): [Book]
    book(id: ID!): Book
    myBooks: [Book]
  }

  type Mutation {
    createBook(title: String!, author: String!, status: String, intent: String, description: String): Book
    deleteBook(id: ID!): Boolean
    updateBook(id: ID!, title: String, author: String, status: String, intent: String, description: String, requests: [RequestInput]): Book
    markRequestAsRead(bookId: ID!, requestIndex: Int!): Book
  }
`;


const resolvers = {
  Query: {
    books: async (_, { filter }) => {
      const db = await connectDB();
      const query = filter ? {
        $or: [{ title: new RegExp(filter, "i") }, { author: new RegExp(filter, "i") }]
      } : {};
      return await db.collection("books").find(query).sort({ createdAt: -1 }).toArray();
    },
    myBooks: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const db = await connectDB();
      return await db.collection("books").find({ ownerId: user.userId }).sort({ createdAt: -1 }).toArray();
    },
  },

  Mutation: {
    createBook: async (_, args, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const db = await connectDB();
      const newBook = {
        ...args,
        ownerId: user.userId, 
        ownerName: user.username,
        requests: [],
        createdAt: new Date().toISOString(),
      };
      const result = await db.collection("books").insertOne(newBook);
      return { _id: result.insertedId, ...newBook };
    },

    updateBook: async (_, args, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const db = await connectDB();
      const collection = db.collection("books");
      const { id, requests, ...otherUpdates } = args;

      const book = await collection.findOne({ _id: new ObjectId(id) });
      if (!book) throw new Error("Book not found");

      
      if (requests && requests.length > 0) {
        const normalizedRequests = requests.map(req => ({
          user: user.username,
          message: req.message,
          isRead: false,
          requestedAt: new Date().toISOString(),
          userId: user.userId
        }));
        await collection.updateOne({ _id: new ObjectId(id) }, { $push: { requests: { $each: normalizedRequests } } });
        return await collection.findOne({ _id: new ObjectId(id) });
      }

     
      if (book.ownerId !== user.userId) throw new Error("Forbidden: You are not the owner");

      const updateData = {};
      Object.keys(otherUpdates).forEach(key => {
        if (otherUpdates[key] !== undefined) updateData[key] = otherUpdates[key];
      });

      if (Object.keys(updateData).length > 0) {
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      }
      return await collection.findOne({ _id: new ObjectId(id) });
    },

    markRequestAsRead: async (_, { bookId, requestIndex }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const db = await connectDB();
      const collection = db.collection("books");
      const book = await collection.findOne({ _id: new ObjectId(bookId) });

      if (book.ownerId !== user.userId) throw new Error("Forbidden");
      
      const requests = [...(book.requests || [])];
      if (requests[requestIndex]) {
        requests[requestIndex].isRead = true;
        await collection.updateOne({ _id: new ObjectId(bookId) }, { $set: { requests } });
      }
      return await collection.findOne({ _id: new ObjectId(bookId) });
    },

    deleteBook: async (_, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const db = await connectDB();
      const result = await db.collection("books").deleteOne({ _id: new ObjectId(id), ownerId: user.userId });
      return result.deletedCount > 0;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, event }) => {
    let authHeader = "";
    if (event?.headers) authHeader = event.headers.authorization || event.headers.Authorization || "";
    else if (req?.headers) authHeader = req.headers.authorization || req.headers.Authorization || "";

    let user = null;
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim().replace(/[\n\r]/g, "");
      try {
        user = jwt.verify(token, secretKey);
      } catch (e) { console.error("JWT Error:", e.message); }
    }
    return { user };
  },
});

let serverHandler;
exports.handler = async (event, context) => {
  if (!serverHandler) {
    await server.start();
    server.applyMiddleware({ app, path: "/", cors: { origin: "*", credentials: true } });
    serverHandler = serverless(app);
  }
  event.path = event.path.replace("/.netlify/functions/graphql", "");
  if (event.path === "") event.path = "/";
  return serverHandler(event, context);
};