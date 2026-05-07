const connectDB = require("./db.cjs");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };
  
  const db = await connectDB();
  const collection = db.collection("users");

  if (event.httpMethod === "POST") {
    const { email, password, username, phone, isLogin } = JSON.parse(event.body);

    if (isLogin) {
      // Логіка входу: шукаємо за поштою та паролем
      const user = await collection.findOne({ email, password });
      if (!user) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Невірний email або пароль" }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(user) };
    } else {
      // Логіка реєстрації: перевіряємо чи пошта унікальна
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Цей email вже зареєстрований" }) };
      }

      const newUser = { username, email, password, phone, createdAt: new Date() };
      const result = await collection.insertOne(newUser);
      return { statusCode: 201, headers, body: JSON.stringify({ _id: result.insertedId, ...newUser }) };
    }
  }
  return { statusCode: 405, headers };
};