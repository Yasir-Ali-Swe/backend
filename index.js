import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.connection.js";
import { PORT } from "./config/env.js";
import authRoutes from "./routes/auth.route.js";
const app = express();

// Middleware
app.use(cors(
  {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }
));
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
