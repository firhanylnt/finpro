import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: number;
    email: string;
    name: string;
    role: number;
    store: number;
  };
}