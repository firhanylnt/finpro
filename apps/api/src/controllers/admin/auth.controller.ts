import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { genSalt, hash, compare } from "bcrypt";
const prisma = new PrismaClient();

export class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const admin = await prisma.admins.findUnique({ where: { email: email } });

            if (!admin) throw new Error("admin Tidak Terdaftar");

            const isPasswordValid = await compare(password, admin.password);

            if (!isPasswordValid) throw new Error("Password salah");

            const token = jwt.sign(
                { email: admin.email, role: admin.role_id, name: admin.fullname, store: admin.store_id },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).cookie("access_token", token).send({
                message: 'Success Login',
                token: token,
            });

        } catch (error) {
            next(error);
        }
    }
}