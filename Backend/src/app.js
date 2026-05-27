import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import teamRoutes from "./routes/teamRoutes.js"

const app = express();

// Global Middleware
app.use(express.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/connections", connectionRoutes);
app.use("/messages", messageRoutes);
app.use("/teams", teamRoutes);

app.get("/", (req, res) => {
  console.log("HIT WITHOUT DB");
  res.json([{ test: true }]);
});

export default app;