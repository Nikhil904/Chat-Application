import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./lib/db.js";
import rateLimit from "express-rate-limit";
import messageRoute from "./routes/message.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import { app,server } from "./lib/Socket.js";

dotenv.config();
const PORT = process.env.PORT;

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all routes
app.use(limiter);
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoute);

server.listen(PORT, () => {
  console.log(`listening on the port number ${PORT}`);
  connectDB();
});
