import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://venkateshwaran2316:12334@cluster0.vdp9kpr.mongodb.net/astroDb?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("db connectes");
  })
  .catch((err) => {
    console.log("error in db connection", err);
  });

let products = "product";
let cartData = "cart";
const ProductModel = mongoose.model(products, {
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: Object,
  qty: Number,
});
const cartModel = mongoose.model(cartData, {
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: Object,
  qty: {
    type: Number,
    required: true,
  },
});

app.get("/", async (req, res) => {
  try {
    let getdata = await ProductModel.find();
    console.log("ddd", getdata);
    res.status(200).json({ data: getdata });
  } catch (error) {
    console.log("error in get db", error);
  }
});
app.get("/product/:id", async (req, res) => {
  try {
    let getdata = await ProductModel.find({ id: req.params.id });
    console.log("ddd", getdata);
    res.status(200).json({ data: getdata });
  } catch (error) {
    console.log("error in get db", error);
  }
});
app.put("/order", async (req, res) => {
  try {
    let getCartItem = await cartModel.find();
    // console.log("updateItem", getCartItem);
    getCartItem.forEach(async (item) => {
      const product = await ProductModel.find({ id: item.id });
      product[0].qty = product[0].qty - item.qty;
      await product[0].save();
    });
    cartModel.collection.drop();
    res.send(200).json({
      message: "success",
      cartlist: [],
    });
  } catch (error) {
    console.log("error in get db", error);
  }
});

// cart DB
app.get("/cartlist", async (req, res) => {
  try {
    let getCartItem = await cartModel.find();
    res.status(200).json({
      message: "success",
      getCartItem,
    });
  } catch (error) {
    console.error("error in add to cart", error);
  }
});
app.post("/carts", async (req, res) => {
  try {
    let createCart = await cartModel.create(req.body);
    res.status(200).json({
      message: "success",
      cartItems: createCart,
    });
  } catch (error) {
    console.error("error in add to cart", error);
  }
});
app.put("/cart/:id", async (req, res) => {
  try {
    let updateItem = await cartModel.findOneAndUpdate(
      {
        id: req.params.id,
      },
      { ...req.body, qty: req.body.qty }
    );
    console.log("updateItem", updateItem);
    res.status(200).json({
      message: "success",
      updateItem,
    });
  } catch (error) {
    console.error("error in add to cart", error);
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    let deleteItem = await cartModel.deleteOne(
      {
        id: req.params.id,
      },
      { ...req.body }
    );
    console.log("updateItem", deleteItem);
    let remainingcart = await cartModel.find();
    res.status(200).json({
      message: "success",
      remainingcart,
    });
  } catch (error) {
    console.error("error in add to cart", error);
  }
});

app.listen(3001, () => {
  console.log("sever started");
});
