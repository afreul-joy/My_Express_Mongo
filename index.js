const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json()); // for handling json data use middleware
app.use(express.urlencoded({ extended: true }));

/*  #################################
         CONNECTING TO MONGODB
    #################################
*/

//--------connecting to database----------
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductDB"); // testproductDb is database name
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

//--------create product schema / STRUCTURE/ SHAPE----------
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  chip: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
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

//------------create product model or collection/table--------------
const products = mongoose.model("products", productSchema); // products is collection/table name

/*  #################################
        CRUD OPERATION STARTING 
    #################################
*/

// ------------CREATE -------------Document/Row/Record
// POST: /products -> Create a new product
app.post("/products", async (req, res) => {
  try {
    //  storing data/document in database
    const newProduct = new products({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      chip: req.body.chip,
    });

    const productData = await newProduct.save(); // save or insert data in database
    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// *** ------------READ------------Document/Row/Record
// GET: /products -> Return all the products
app.get("/products", async (req, res) => {
  try {
    const product = await products.find();
    if (product) {
      res.status(200).send({
        success: true, // ***response extra information
        message: "Return all the product",
        data: product,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// Get: /products/:id -> Return a specific product
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await products.findOne({ _id: id });
    if (product) {
      res.status(200).send({
        success: true, // ***response extra information
        message: "Return a single product",
        data: product,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

//------------- Search implemented ---------
app.get("/search", async (req, res) => {
  try {
    const price = parseFloat(req.query.price); // Parse the price query parameter to a number
    const rating = parseFloat(req.query.rating);
    let product;
    if (price && rating) {
      product = await products.find({
        $and: [{ price: { $lte: price } }, { rating: { $gte: rating } }],
      }); // only return products specified products
    } else {
      product = await products.find(); // show all products
    }

    if (product) {
      res.status(200).send({
        success: true,
        message: "Return search results",
        data: product,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "No matching products found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});
//----------------- Sort Data ----------------
app.get("/meals", async (req, res) => {
  try {
    //*** 1=ascending sort|| -1=descending sort
    const product = await products.find().sort({ price: -1 }); // sorting by price
    if (product) {
      res.status(200).send({
        success: true,
        message: "Return all the product",
        data: product,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});
//------------- Counting Total Numbers Of Data ---------
app.get("/service", async (req, res) => {
  try {
    const product = await products.find();
    const numberOfProduct = await products.find().countDocuments(); // count the number of documents
    if (product) {
      res.status(200).send({
        success: true, // ***response extra information
        message: "Return all the product",
        numberOfProducts: numberOfProduct,
        data: product,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});
// *** ------------UPDATE------------Document/Row/Record
app.put("/service/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // in update method: 1st need id, 2nd set new value for this update;
    const updatedProduct = await products.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title: req.body.title,   // set new value for this update
          rating: req.body.rating,
        },
      },
      {new:true} // showing updated data in api
    );
    if (updatedProduct) {
      res.status(200).send({
        success: true,
        message: "Updated successfully",
        data: updatedProduct,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product was not updated with this id",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});
// *** ------------DELETE------------Document/Row/Record
app.delete("/service/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const productDelete = await products.findByIdAndDelete({ _id: id }); // showing details of deleted product
    // const productDelete = await products.deleteOne({_id: id}); // delete normally showing "acknowledgement:true"

    if (productDelete) {
      res.status(200).send({
        success: true,
        message: "Delete successfully",
        data: productDelete,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product was not deleted with this id",
      });
    }
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
  await connectDB(); // Connection function called when server is running
});

// Database -> collection ( table) -> document  (record)

// GET: /products -> Return all the products
// Get: /products/:id -> Return a specific product
// POST: /products -> Create a new product
// PUT: /products/:id -> Update a specific product based on id
// DELETE: /products/:id -> Delete a product based on id
