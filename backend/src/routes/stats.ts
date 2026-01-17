import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

// GET /api/stats - Get dashboard statistics
router.get('/', async (req: Request, res: Response) => {
    try {
        const totalReports = await prisma.report.count();
        const newReports = await prisma.report.count({ where: { status: 'NEW' } });
        const inProgressReports = await prisma.report.count({ where: { status: 'IN_PROGRESS' } });
        const resolvedReports = await prisma.report.count({ where: { status: 'RESOLVED' } });

        // Get reports by category
        const categories = await prisma.report.groupBy({
            by: ['category'],
            _count: {
                _all: true
            }
        });

        const reportsByCategory: Record<string, number> = {};
        categories.forEach(item => {
            reportsByCategory[item.category] = item._count._all;
        });

        // Calculate avg resolution time (approx)
        const resolvedReportsData = await prisma.report.findMany({
            where: {
                status: 'RESOLVED',
                resolvedAt: { not: null }
            },
            select: {
                createdAt: true,
                resolvedAt: true
            }
        });

        let avgResolutionTime = 0;
        if (resolvedReportsData.length > 0) {
            const totalHours = resolvedReportsData.reduce((acc, report) => {
                const diff = report.resolvedAt!.getTime() - report.createdAt.getTime();
                return acc + (diff / (1000 * 60 * 60));
            }, 0);
            avgResolutionTime = Math.round(totalHours / resolvedReportsData.length);
        }

        res.json({
            status: 'success',
            data: {
                totalReports,
                newReports,
                inProgressReports,
                resolvedReports,
                avgResolutionTime,
                reportsByCategory
            }
        });
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;
