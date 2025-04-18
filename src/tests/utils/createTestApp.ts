import express from "express";
import { handleError } from "../../middlewares/handleError";
import userRoutes from "@/routes/userRoutes";

export function createTestApp() {
  const app = express();
  app.use(express.json());

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

  return app;
}
