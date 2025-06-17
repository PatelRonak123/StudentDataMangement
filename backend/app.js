const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors")
const authRoute = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const studentRoute = require("./routes/studentRoute");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))

app.get("/", (req, res) => {
  res.send("Server is working Fine"); //For testing purpose
});

app.use("/api/v1", authRoute);
app.use("/api/v1", studentRoute);
module.exports = app;
