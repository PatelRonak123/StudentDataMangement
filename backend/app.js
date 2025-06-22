const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const adminRoute = require("./routes/adminRoute");
const studentRoute = require("./routes/studentRoute");
const instituteRoute = require("./routes/instituteRoute");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://educonnect-flax.vercel.app",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Server is working Fine");
});

app.use("/api/v1", authRoute);
app.use("/api/v1", adminRoute);
app.use("/api/v1", studentRoute);
app.use("/api/v1", instituteRoute);

module.exports = app;
