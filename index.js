const config = require("dotenv");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("./assets"))
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "123tev",
    resave: true,
    saveUninitialized: true,
  })
);
app.listen(parseInt(process.env.PORT) , (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("connected");
    }
});

mongoose.connect(process.env.URLBDD)