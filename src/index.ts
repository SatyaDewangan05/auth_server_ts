import express, { Request, Response, NextFunction } from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { protect } from "./middlewares/authMiddleware";
import path from "path";
import cors from "cors"; // Import CORS middleware
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*", // Replace with your React app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

app.use(bodyParser.json());
app.use(cookieParser());

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  res.status(200).send("Connected to Server");
});

// Routes
app.use("/api/auth", authRoutes);

// User
app.use("/api/users", userRoutes);

// Protected Route (Welcome Page)
app.get("/welcome", protect, (req: Request, res: Response) => {
  res.render("welcome", { user: (req as any).user }); // TypeScript might not know about req.user
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
