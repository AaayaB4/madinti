import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'success',
        message: 'Madinti API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

export default router;
