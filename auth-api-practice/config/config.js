import dotenv from "dotenv";

// Load environment variables (only once)
dotenv.config();

// Export configuration values safely
export const config = {
  port:process.env.PORT||5000,
  mongoURL:process.env.MONGO_URL||"mongodb://127.0.0.1:27017/defaultDB",
  jwtSecret:process.env.JWT_SECRET||"defaultSecret",
  refreshSecret: process.env.REFRESH_SECRET || "defaultRefreshSecret",
};