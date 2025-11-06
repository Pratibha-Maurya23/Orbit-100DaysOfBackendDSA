const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");
require('dotenv').config();

const User = require('./models/user');

const app = express();
app.use(express.json());

// Register
  app.post('/register',async (req, res) =>{
    try{
  const {email, password,name,age} = req.body;

  const hashedPass = await bcrypt.hash(password, 10);
  const newUser  = await User.create({ email, password:hashedPass,name,age});

  res.status(201).json({message: "User register ☑️",user:newUser});
}catch(err){
  res.status(500).json({message: err.message});
}
});

// get all users 
app.get("/users",auth,async(req,res)=>{
  try{
    const users = await User.find({},"-password");
    res.json(users);
  }catch(err){
    res.status(500).json({message: err.message});
  }
})

// Get single user by ID
app.get("/user/:id",auth, async (req,res)=>{
  try{
    const user = await User.findById(req.params.id,"-password");
    if(!user) return res.status(404).json({message:"User not found ❌"});
    res.json(user);
  }catch(err){
    res.status(500).json({message: err.message});
  }
})

// update the password
app.put("/users/:id",auth,async (req,res)=>{
  try{
    const updates = req.body;
    if(updates.password){
      updates.password = await bcrypt.hash(updates.password,10);
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id,updates,{new:true});
    if(!updateUser) res.status(404).json({message:"User not found ❌"});

    res.json(updateUser);
  }catch(err){
    res.status(500).json({message: err.message});
  }
})

// delete user
app.put("/users/:id",auth,async (req,res)=>{
  try{
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if(!updateUser) res.status(404).json({message:"User not found ❌"});

    res.json({message:"User delete "});
  }catch(err){
    res.status(500).json({message: err.message});
  }
})

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


const PORT = process.env.PORT||5000;
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log("DB Connected ");
app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));

})
.catch((err)=>console.log(err));
