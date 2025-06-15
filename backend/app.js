const express = require("express");
const app = express();
const dotenv = require("dotenv");
const authRoute = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is working Fine"); //For testing purpose
});

app.use("/api/v1", authRoute);
module.exports = app;
