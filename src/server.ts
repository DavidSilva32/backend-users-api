import "dotenv/config";
import express from "express";
import userRoutes from "./routes/userRoutes";
import { handleError } from "./middlewares/handleError";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // habilita cookies se usar no futuro
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>API de usuários está no ar 🚀</h1>");
});

app.use(userRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    handleError(err, req, res, next);
  }
);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
