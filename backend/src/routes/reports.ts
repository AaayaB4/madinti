import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/reports - List all reports
router.get('/', async (req: Request, res: Response) => {
    try {
        const reports = await prisma.report.findMany({
            take: 100,
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
        console.error('Error fetching reports:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST /api/reports - Create new report
router.post('/', async (req: Request, res: Response) => {
    try {
        const {
            userId = 'temp-user-id', // TODO: Get from auth token
            category,
            description,
            locationLat,
            locationLng,
            address,
            photoUrls = []
        } = req.body;

        // Validation
        if (!category || !locationLat || !locationLng) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: category, locationLat, locationLng'
            });
        }

        // Create or get temp user
        let user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    phoneNumber: '+212600000000',
                    phoneHash: 'temp-hash',
                    fullName: 'Temporary User',
                    role: 'CITIZEN'
                }
            });
        }

        // Create report
        const report = await prisma.report.create({
            data: {
                userId: user.id,
                category,
                description: description || null,
                locationLat: parseFloat(locationLat),
                locationLng: parseFloat(locationLng),
                address: address || null,
                photoUrls: photoUrls,
                status: 'NEW',
                priority: 2,
                upvoteCount: 0
            },
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

        res.status(201).json({
            status: 'success',
            data: report
        });
    } catch (error: any) {
        console.error('Error creating report:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /api/reports/:id - Get single report
router.get('/:id', async (req: Request, res: Response) => {
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
        console.error('Error fetching report:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// PATCH /api/reports/:id - Update report
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { status, priority, assignedToId } = req.body;

        const report = await prisma.report.update({
            where: { id: req.params.id },
            data: {
                ...(status && { status }),
                ...(priority && { priority }),
                ...(assignedToId && { assignedToId }),
                ...(status === 'RESOLVED' && { resolvedAt: new Date() })
            },
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
            data: report
        });
    } catch (error: any) {
        console.error('Error updating report:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;
