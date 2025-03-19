import { authLogin } from "../../services/auth.service";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';

export class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const admin = await authLogin(req.body);

            const token = jwt.sign(
                { id: admin.id, email: admin.email, role: admin.role_id, name: admin.fullname, store: admin.store_id },
                JWT_SECRET,
                { expiresIn: '7d' }
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