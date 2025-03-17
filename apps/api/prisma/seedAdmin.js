const { PrismaClient } = require('@prisma/client');
const { genSalt, hash } = require('bcrypt');

const prisma = new PrismaClient();

async function seedRoles() {
    const rolesData = [
        { id: 1, name: 'Super Admin' },
        { id: 2, name: 'Store Admin' },
    ];

    for (const role of rolesData) {
        const existingRole = await prisma.roles.findUnique({
            where: { id: role.id },
        });

        if (!existingRole) {
            await prisma.roles.create({
                data: {
                    name: role.name,
                    description: 'Super Admin'
                }
            });
            console.log(`Role '${role.name}' seeded successfully.`);
        } else {
            console.log(`Role '${role.name}' already exists. Skipping...`);
        }
    }
}

async function seedStores() {
    try {
        await seedRoles();

        const storeData = [
            { id: 1, name: 'Kemang', lat: '0', long: '0', description: 'Store Kemang' },
            { id: 2, name: 'Pejaten', lat: '1', long: '1', description: 'Store Pejaten' },
        ];
    
        for (const store of storeData) {
            const existingstore = await prisma.stores.findUnique({
                where: { id: store.id },
            });
    
            if (!existingstore) {
                await prisma.stores.create({
                    data: {
                        name: store.name,
                        description: store.description,
                        lat: store.lat,
                        long: store.long,
                        createdBy: 1,
                        updatedBy: 1,
                    }
                });
                console.log(`store '${store.name}' seeded successfully.`);
            } else {
                console.log(`store '${store.name}' already exists. Skipping...`);
            }
        }
    } catch (error) {
        console.error('Error seeding store:', error.message);
    } finally {
        await prisma.$disconnect();
    }
    
}

async function seedAdmin() {
    try {
        await seedStores();

        const adminData = {
            fullname: 'Super Admin',
            email: 'superadmin@mail.com',
            password: '123admin!',
            role_id: 1,
        };

        const checkUser = await prisma.admins.findUnique({
            where: { email: adminData.email },
        });

        if (checkUser) {
            console.log('Email sudah terdaftar. Skipping...');
            return;
        }

        const roles = await prisma.roles.findUnique({
            where: { id: adminData.role_id },
        });

        if (!roles) {
            throw new Error('Role tidak ada');
        }

        const salt = await genSalt(10);
        const hashPassword = await hash(adminData.password, salt);

        await prisma.$transaction(async (prisma) => {
            const admin = await prisma.admins.create({
                data: {
                    fullname: adminData.fullname,
                    email: adminData.email,
                    password: hashPassword,
                    role_id: roles.id,
                    status: true,
                    createdBy: adminData.created_by,
                },
            });

            console.log('Admin created successfully:', admin);
        });

    } catch (error) {
        console.error('Error seeding admin:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
