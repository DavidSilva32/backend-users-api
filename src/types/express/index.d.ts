import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
  }
}
