import "dotenv/config";
import express from "express";
import userRoutes from "./modules/user/userRoutes";
import { handleError } from "./middlewares/handleError";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>API de usuários está no ar 🚀</h1>");
});

app.use("/api", userRoutes);

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
