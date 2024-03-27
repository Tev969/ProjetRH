const config = require("dotenv");
const twig = require("twig");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dashBoardRouter = require("./src/routers/dashboardRouter");
const userRouter = require("./src/routers/userRouter");
const employeeRouter = require("./src/routers/employeeRouter");
require("dotenv").config();

const app = express();
app.use(express.static("./assets"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "123tev",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(dashBoardRouter);
app.use(userRouter);
app.use(employeeRouter);

app.listen(parseInt(process.env.PORT), (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});

app.get("*" , (req,res)=> {
    res.redirect("/dashboard")
})

mongoose.connect(process.env.URLBDD);
