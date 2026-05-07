// const { MongoClient } = require("mongodb");

// // Зчитуємо URI з файлу .env
// const client = new MongoClient(process.env.MONGO_URI);

// // Назва вашої колекції для книг
// let collectionName = "books"; 
// let db;

// async function connectDB() {
//   try {
//     if (!db) {
//       // Встановлюємо з'єднання
//       await client.connect();
//       // Підключаємося до конкретної бази (назва бази може бути вказана в URI або окремою змінною)
//       db = client.db("Web-tech"); 
//       console.log("Successfully connected to MongoDB");
//     }
//     return db.collection(collectionName);
//   } catch (error) {
//     console.error("Connection to MongoDB failed:", error.message);
//     throw error;
//   }
// }

// module.exports = connectDB;


const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("Web-tech");
  }
  return db;
}

module.exports = connectDB;