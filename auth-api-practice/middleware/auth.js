const jwt = require("jsonwebtoken");
const User = require('../models/user');
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token ❌" });

   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token ❌" });
    req.user = user;
    next();
  });
};
