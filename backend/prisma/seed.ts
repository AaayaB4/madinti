import { PrismaClient, Category, Role, ReportStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create Admins
    const adminPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.upsert({
        where: { phoneNumber: '+212600000001' },
        update: {
            password: adminPassword,
            email: 'admin@madinti.ma',
            role: Role.ADMIN
        },
        create: {
            email: 'admin@madinti.ma',
            password: adminPassword,
            fullName: 'Mohammed El Amrani',
            role: Role.ADMIN,
            phoneNumber: '+212600000001',
            phoneHash: 'hash_admin_1',
            phoneVerified: true,
        },
    });

    await prisma.user.upsert({
        where: { phoneNumber: '+212600000002' },
        update: {
            password: adminPassword,
            email: 'superadmin@madinti.ma',
            role: Role.SUPER_ADMIN
        },
        create: {
            email: 'superadmin@madinti.ma',
            password: adminPassword,
            fullName: 'Laila Bensouda',
            role: Role.SUPER_ADMIN,
            phoneNumber: '+212600000002',
            phoneHash: 'hash_admin_2',
            phoneVerified: true,
        },
    });

    // 2. Create Field Workers
    await prisma.user.upsert({
        where: { phoneNumber: '+212611111111' },
        update: {},
        create: {
            phoneNumber: '+212611111111',
            phoneHash: 'hash_worker_1',
            fullName: 'Yassine Touzani',
            role: Role.FIELD_WORKER,
            phoneVerified: true,
        },
    });

    // 3. Create Citizens
    const citizen1 = await prisma.user.upsert({
        where: { phoneNumber: '+212622222222' },
        update: {},
        create: {
            phoneNumber: '+212622222222',
            phoneHash: 'hash_citizen_1',
            fullName: 'Anass Lamrani',
            role: Role.CITIZEN,
            phoneVerified: true,
            cinNumber: 'AB123456',
            cinHash: 'hash_cin_1',
        },
    });

    // 4. Create Fake Reports for Sidi Slimane
    const reportsData = [
        {
            category: Category.WASTE,
            description: 'Accumulation de déchets près du marché central.',
            locationLat: 34.2630,
            locationLng: -5.9210,
            address: 'Sidi Slimane, Centre Ville',
            status: ReportStatus.NEW,
            priority: 3,
            userId: citizen1.id,
        },
        {
            category: Category.LIGHTING,
            description: 'Plusieurs lampadaires ne fonctionnent plus sur l\'avenue Hassan II.',
            locationLat: 34.2615,
            locationLng: -5.9180,
            address: 'Avenue Hassan II, Sidi Slimane',
            status: ReportStatus.IN_PROGRESS,
            priority: 4,
            userId: citizen1.id,
        },
        {
            category: Category.ROAD,
            description: 'Grosse fissure sur la route près du pont.',
            locationLat: 34.2650,
            locationLng: -5.9250,
            address: 'Quartier Administratif',
            status: ReportStatus.ACKNOWLEDGED,
            priority: 5,
            userId: citizen1.id,
        },
        {
            category: Category.WATER,
            description: 'Fuite d\'eau importante sur un tuyau principal.',
            locationLat: 34.2580,
            locationLng: -5.9150,
            address: 'Lotissement Al Qods',
            status: ReportStatus.NEW,
            priority: 5,
            userId: citizen1.id,
        },
        {
            category: Category.PUBLIC_SPACE,
            description: 'Entretien nécessaire du jardin public.',
            locationLat: 34.2680,
            locationLng: -5.9300,
            address: 'Parc Municipal',
            status: ReportStatus.RESOLVED,
            priority: 2,
            userId: citizen1.id,
        },
        {
            category: Category.SANITATION,
            description: 'Problème de canalisation bouchée.',
            locationLat: 34.2600,
            locationLng: -5.9350,
            address: 'Boulevard Mohammed V',
            status: ReportStatus.ACKNOWLEDGED,
            priority: 3,
            userId: citizen1.id,
        },
    ];

    await prisma.report.deleteMany({}); // Clear old reports

    for (const data of reportsData) {
        await prisma.report.create({
            data
        });
    }

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
