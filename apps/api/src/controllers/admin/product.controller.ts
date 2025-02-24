import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "@/custom";
import cloudinary from '@/cloudinary';
const prisma = new PrismaClient();

export class ProductController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { name, product_category_id, description, price, status, created_by } = req.body;

            console.log(req.body);
            const checkExist = await prisma.products.findUnique({
                where: { name: String(name) },
            });

            if (checkExist) throw new Error("Product sudah terdaftar");

            await prisma.$transaction(async (prisma) => {
                const product = await prisma.products.create({
                    data: {
                        name: name,
                        product_category_id: Number(product_category_id),
                        description: description,
                        price: price,
                        status: status === 'true' ? true : false,
                        createdBy: req.admin?.id,
                        updatedBy: req.admin?.id,
                    },
                });
                const files = req.files as Express.Multer.File[];
                const imageUploads = await Promise.all(
                    files.map(async (file) => {
                        const result = await cloudinary.uploader.upload(file.path, {
                            folder: 'products',
                        });
                        return prisma.productImages.create({
                            data: {
                                product_id: product.id,
                                image_name: file.filename,
                                image_url: result.secure_url,
                            },
                        });
                    })
                );
            });

            res.status(200).send({
                message: 'Success Create Product',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, product_category_id, description, price, status, updated_by } = req.body;

            const checkExist = await prisma.products.findUnique({
                where: { name },
            });

            if (!checkExist) throw new Error("Product Tidak Terdaftar");

            const update = await prisma.products.update({
                where: { id: Number(id) },
                data: {
                    name: name,
                    product_category_id: product_category_id,
                    description: description,
                    price: price,
                    status: status,
                    updatedBy: req.admin?.id,
                    updatedAt: new Date(),
                },
            });

        } catch (error) {
            next(error);
        }
    }

    async getList(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const product = await prisma.products.findMany({
                select: {
                    id: true, name: true
                },
                orderBy: { name: 'asc' }
            });

            res.status(200).send({
                message: 'Get Products',
                data: product,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                search?: string;
                sortBy?: string;
                sortOrder?: string;
                page: number;
            }
        
            const { search, sortBy, sortOrder, page } = req.query;
        
            const filter: IFilter = {
                search: search ? String(search) : "",
                sortBy: sortBy ? String(sortBy) : "name",
                sortOrder: sortOrder === "desc" ? "desc" : "asc",
                page: parseInt(page as string) || 1,
            };

            const whereCondition: any = {
                AND: [
                    { deletedAt: null },
                ],
            };

            if (filter.search) {
                whereCondition.OR = [
                    { name: { contains: filter.search, mode: "insensitive" } },
                    { productcategory: { name: { contains: filter.search, mode: "insensitive" } } }
                ];
            }

            const orderBy: Record<string, "asc" | "desc"> = {};
            if (filter.sortBy) {
                orderBy[filter.sortBy] = filter.sortOrder === "desc" ? "desc" : "asc";
            }

            const data = await prisma.products.findMany({
                select: {
                    id: true, name: true, price: true, description: true, status: true, createdAt: true,
                    productcategory: true,
                },
                where: whereCondition,
                orderBy,
                skip: filter.page != 1 ? (filter.page - 1) * 10 : 0,
                take: 10,
            });

            res.status(200).send({
                message: 'Get All Product',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        const category = await prisma.products.findUnique({
            where: { id: Number(id) },
        });

        if (!category) throw new Error("Category Tidak Ditemukan");

        res.status(200).send({
            message: 'Get Category By Id',
            data: category,
        })
    }

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        const category = await prisma.products.findUnique({
            where: { id: Number(id) },
        });

        if (!category) throw new Error("Category Tidak Terdaftar");

        await prisma.products.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send({
            message: 'Category berhasil dihapus',
        })
    }
}