"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const handleError_1 = require("./middlewares/handleError");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true, // habilita cookies se usar no futuro
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("<h1>API de usuários está no ar 🚀</h1>");
});
app.use(userRoutes_1.default);
app.use((err, req, res, next) => {
    (0, handleError_1.handleError)(err, req, res, next);
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
