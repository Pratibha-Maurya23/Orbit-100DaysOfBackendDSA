const express = require("express");
const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();

app.get("/profile", auth, (req, res) => {
  res.json({ message: "Access Granted ✅", user: req.user });
});

app.listen(5000, () => console.log("Middleware test ➜ http://localhost:5000"));
