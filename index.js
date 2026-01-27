import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import { connectDB } from "./config/db-connection.js";
import authRoutes from "./routes/auth-routes.js";
import clientRoutes from "./routes/client-routes.js";
import lawyerRoutes from "./routes/lawyer-routes.js";
import adminRoutes from "./routes/admin-route.js";
import caseRoutes from "./routes/case-route.js";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});

app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/lawyer", lawyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/case", caseRoutes);

