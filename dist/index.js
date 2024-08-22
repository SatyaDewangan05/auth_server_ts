"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors")); // Import CORS middleware
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*", // Replace with your React app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
(0, db_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// Set view engine
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send("Connected to Server");
}));
// Routes
app.use("/api/auth", authRoutes_1.default);
// User
app.use("/api/users", userRoutes_1.default);
// Protected Route (Welcome Page)
app.get("/welcome", authMiddleware_1.protect, (req, res) => {
    res.render("welcome", { user: req.user }); // TypeScript might not know about req.user
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
