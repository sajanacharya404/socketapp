import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

export { AuthenticatedRequest };
