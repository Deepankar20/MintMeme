import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; wallet: string }; // you can type this better if you know the structure
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = JSON.parse(decoded as string) as {
      id: string;
      wallet: string;
    };

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
