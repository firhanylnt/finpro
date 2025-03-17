import { PrismaClient } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
const prisma = new PrismaClient();

export const authLogin = async(body: any) => {

    try {
        const admin = await prisma.admins.findUnique({ where: { email: body.email } });

        if (!admin) throw new Error("admin Tidak Terdaftar");

        const isPasswordValid = await compare(body.password, admin.password);

        if (!isPasswordValid) throw new Error("Password salah");

        return admin;
    } catch (error: any) {
        throw new Error(error);
    }
    
}