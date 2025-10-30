const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require("../auth-api-practice/middleware/auth");
require('dotenv').config();

const User = require('./models/user');

const app = express();
app.use(express.json());

// Register
app.post('/register',async (req, res) =>{
  const {email, password} = req.body;

  const hashedPass = await bcrypt.hash(password, 10);
  await User.create({ email, password:hashedPass});

  res.json({message: "User register ☑️"});
});

// Login
app.post("/login",async (req, res)=>{
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if(!user) return res.status(404).json({message:"User not found ❌"});

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return res.status(403).json({message:"Wrong password ❌"});

  //creating a access token
  const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {
    expiresIn:'1h',
  });

  res.json({token});
});

// Protected Route using middleware
app.get("/profile", auth, (req, res) => {
  res.json({ message: "Access Granted ✅", user: req.user });
});


const PORT = 5000;
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log("DB Connected ");
app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));

})
.catch((err)=>console.log(err));
