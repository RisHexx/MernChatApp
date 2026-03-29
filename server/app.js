const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// health route (important for CI)
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.send("ok");
});

module.exports = app;