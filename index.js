const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductDB");
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await connectDB();
});
