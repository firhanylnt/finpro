import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config";
import { AuthenticatedRequest } from "../custom";
import { verify } from "jsonwebtoken";

async function VerifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new Error("Unauthorized");

    const admin = verify(token, JWT_SECRET as string);

    if (!admin) throw new Error("Unauthorized");

    req.admin = admin as any;

    next();
  } catch (err) {
    next(err);
  }
}

async function AdminGuard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    console.log(req.admin?.role);
    if (String(req.admin?.role) !== "1") throw new Error("Not an Super Admin");

    next();
  } catch (err) {
    next(err);
  }
}

export { VerifyToken, AdminGuard };