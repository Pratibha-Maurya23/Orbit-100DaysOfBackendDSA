const express = require('express');
const mongoose = require('mongoose');
const { authRouter } = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const {config} = require("./config/config");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend-domain.com"
  ],
  credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);


const PORT = config.port;
const MONGO_URL = config.mongoURL;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log("DB Connected ");
app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));

})
.catch((err)=>console.log(err));
