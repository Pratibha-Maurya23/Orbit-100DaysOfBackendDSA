const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
   role: {
    type: String,
    enum: ["user", "pharmacist", "admin"],
    default: "user",  
  },
});

module.exports = mongoose.model('User', userSchema);
