import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config";
import { Admin } from "../custom";
import { verify } from "jsonwebtoken";

async function VerifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new Error("Unauthorized");

    const admin = verify(token, JWT_SECRET as string);

    if (!admin) throw new Error("Unauthorized");

    req.admin = admin as Admin;

    next();
  } catch (err) {
    next(err);
  }
}

async function AdminGuard(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.admin?.role);
    if (String(req.admin?.role) !== "1") throw new Error("Not an Super Admin");

    next();
  } catch (err) {
    next(err);
  }
}

export { VerifyToken, AdminGuard };