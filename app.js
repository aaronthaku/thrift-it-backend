const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(__dirname + "/userImages"));
app.use(express.static(__dirname + "/productImgs"));

// Importing Database Connectio
const connectDB = require("./config/dbconnection");
connectDB();

// Importing Routers // Models are imported in routers
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");

app.use(userRouter);
app.use(productRouter);

app.listen(90);

module.exports = app;
