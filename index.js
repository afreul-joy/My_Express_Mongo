const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json()); // for handling json data use middleware
app.use(express.urlencoded({extended: true})); 

// create product schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },    
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create product model
const products = mongoose.model("products", productSchema); // products is collection name

// connecting to database
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductDB"); // testproductDb is database name
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

app.post("/products", async (req, res) => {
  try {
    // get data from request body
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;

    //  storing data in database
    const newProduct = new products({
      title: title,
      price: price,
      description: description,
    });

    const productData = await newProduct.save();
    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await connectDB();
});

// Database -> collection ( table) -> document  (record)
