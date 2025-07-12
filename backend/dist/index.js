"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const groups_1 = __importDefault(require("./routes/groups"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/tasks", tasks_1.default);
app.use("/api/groups", groups_1.default);
// Database connection and server start
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connection established");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
});
