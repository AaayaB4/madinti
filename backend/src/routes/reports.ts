import { Router } from 'express';
import prisma from '../config/database';

const router = Router();

// GET /api/reports - List all reports
router.get('/', async (req, res) => {
    try {
        const reports = await prisma.report.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        phoneNumber: true,
                        fullName: true
                    }
                }
            }
        });

        res.json({
            status: 'success',
            data: reports
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST /api/reports - Create new report
router.post('/', async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// GET /api/reports/:id - Get single report
router.get('/:id', async (req, res) => {
    try {
        const report = await prisma.report.findUnique({
            where: { id: req.params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        phoneNumber: true,
                        fullName: true
                    }
                },
                updates: true
            }
        });

        if (!report) {
            return res.status(404).json({
                status: 'error',
                message: 'Report not found'
            });
        }

        res.json({
            status: 'success',
            data: report
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;
