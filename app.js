require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/userImages"));
app.use(express.static(__dirname + "/productImgs"));

// Importing Database Connectio
const connectDB = require("./config/dbconnection");
connectDB();

app.use(
  cookieSession({
    name: "session",
    keys: ["akatsuki"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Importing Routers // Models are imported in routers
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");

const passportSetup = require("./passport");
const thirdpartyRouter = require("./routers/thirdpartyRouter");
const otpRouter = require("./routers/otpRouter");

const reviewRouter = require("./routers/reviewRouter");
const wishlistRouter = require("./routers/wishlistRouter");

const recommendation = require("./routers/recommendation");

app.use(userRouter);
app.use(productRouter);
app.use(wishlistRouter);

app.use(recommendation);

app.use(reviewRouter);
app.use("/thirdpartyRouter", thirdpartyRouter);
app.use(otpRouter);

app.listen(90);

module.exports = app;
