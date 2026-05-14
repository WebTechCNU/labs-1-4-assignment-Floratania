const connectDB = require("./db.cjs");
const jwt = require("jsonwebtoken");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };
  
  const db = await connectDB();
  const collection = db.collection("users");
  const secretKey = process.env.JWT_SECRET;

  if (event.httpMethod === "POST") {
    const { email, password, username, phone, isLogin } = JSON.parse(event.body);

    if (isLogin) {
      const user = await collection.findOne({ email, password });
      if (!user) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Невірні облікові дані" }) }; 
      }

     
      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email, username: user.username }, 
        secretKey, 
        { expiresIn: "1h" }
      );

      const { password: _, ...userWithoutPassword } = user;
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({ token, user: userWithoutPassword }) 
      };

    } else {
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Цей email вже зайнятий" }) };
      }

      const newUser = { username, email, password, phone, createdAt: new Date() }; 
      const result = await collection.insertOne(newUser);

      const token = jwt.sign(
        { userId: result.insertedId.toString(), email, username }, 
        secretKey, 
        { expiresIn: "1h" }
      );

      return { 
        statusCode: 201, 
        headers, 
        body: JSON.stringify({ token, user: { _id: result.insertedId, username, email, phone } }) 
      };
    }
  }
  return { statusCode: 405, headers };
};