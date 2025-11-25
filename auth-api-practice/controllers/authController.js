const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { refreshTokens } = require("../utils/tokenStore");

const User = require('../models/user');

// Register
exports.registerUser = async (req, res) =>{
    try{
  const {email, password,name,age} = req.body;

  const hashedPass = await bcrypt.hash(password, 10);
  const newUser  = await User.create({ email, password:hashedPass,name,age});

  res.status(201).json({message: "User register ☑️",user:newUser});
}catch(err){
  res.status(500).json({message: err.message});
}
};

// Login
exports.loginUser = async (req, res) => {
    try {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if(!user) return res.status(404).json({message:"User not found ❌"});

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return res.status(403).json({message:"Wrong password ❌"});

  const payload = {id: user._id, email: user.email, role: user.role};
  //creating a access token
  const accesstoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshtoken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });


  console.log("Access Token:", accesstoken);
  console.log("Refresh Token:", refreshtoken);

  refreshTokens.push(refreshtoken);

  res.json({accesstoken,refreshtoken});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};