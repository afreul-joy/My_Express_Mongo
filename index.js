const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json()); // for handling json data use middleware
app.use(express.urlencoded({extended: true})); 


/*  #################################
         CONNECTING TO MONGODB
    #################################
*/

//  ***create product schema / STRUCTURE/ SHAPE 
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

//  ***create product model or collection/table
const products = mongoose.model("products", productSchema); // products is collection/table name
 

// ***connecting to database
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductDB"); // testproductDb is database name
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};
/*  #################################
        CRUD OPERATION STARTING 
    #################################
*/

// ***CREATE ------------Document/Row/Record
app.post("/products", async (req, res) => {
  try {
    //  storing data/document in database
    const newProduct = new products({
      title: req.body.title,
      price:  req.body.price,
      description: req.body.description,
    });
 
    const productData = await newProduct.save();  // save or insert data in database
    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  } 
});

// ***READ  ------------Document/Row/Record
app.get("/products", async (req,res)={

})

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await connectDB();   // Connection function called when server is running
});

// Database -> collection ( table) -> document  (record)

// GET: /products -> Return all the products
// Get: /products/:id -> Return a specific product
// POST: /products -> Create a new product
// PUT: /products/:id -> Update a specific product based on id
// DELETE: /products/:id -> Delete a product based on id

