const connectDB = require("./db.cjs");
const { ObjectId } = require("mongodb");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };

  const db = await connectDB();
  const collection = db.collection("books");
  const id = event.path.split("/").pop();
  const method = event.httpMethod;

  try {
    switch (method) {
      case "GET":
        const books = await collection.find({}).toArray();
        return { statusCode: 200, headers, body: JSON.stringify(books) };

      case "POST":
        const newData = JSON.parse(event.body);
        const result = await collection.insertOne({
          ...newData,
          requests: [],
          createdAt: new Date()
        });
        return { statusCode: 201, headers, body: JSON.stringify(result) };

      case "PUT":
        if (!id) return { statusCode: 400, headers, body: "ID required" };
        const updateData = JSON.parse(event.body);
        
        let action;
        if (updateData.newRequest) {
          // Додавання нового запиту від покупця
          action = { $push: { requests: updateData.newRequest } };
        } else if (updateData.requests) {
          // Оновлення списку запитів власником (наприклад, мітка "прочитано")
          action = { $set: { requests: updateData.requests } };
        } else {
          // Редагування самої книги
          if (updateData._id) delete updateData._id;
          action = { $set: updateData };
        }

        await collection.updateOne({ _id: new ObjectId(id) }, action);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

      case "DELETE":
        await collection.deleteOne({ _id: new ObjectId(id) });
        return { statusCode: 204, headers, body: "" };

      default:
        return { statusCode: 405, headers };
    }
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};