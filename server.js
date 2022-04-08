const express = require("express");
const morgan = require("morgan"); //HTTP request logger middleware for node.js
const connectDB = require("./config/db");

const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoruRoute");

require("dotenv").config();
require("colors");

connectDB(); //connecting mongoDB

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // NOTE-> It makes TLS connections and HTTPS requests insecure by disabling certificate verification for mail.
}

//middlewares
app.use(express.json()); //to access json type data
app.use(express.urlencoded({ extended: false })); //to access url type data

app.use("/api/users", userRoute); // add this user router to use middleware
app.use("/api/category", categoryRoute);

app.get("*", function (req, res) {
  console.log("Hello world!...");
  res.status(404).send("Endpoint does not exist...");
});

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server is connect in ${process.env.NODE_ENV} mode on port ${PORT}`
      .brightRed
  )
);
