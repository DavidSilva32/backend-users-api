import express from "express";
import { handleError } from "../../middlewares/handleError";
import { authMiddleware } from "../../middlewares/authMiddleware";

export function createTestApp() {
  const app = express();
  app.use(express.json());

  app.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({ message: "Access granted", user: req.user });
  });

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
