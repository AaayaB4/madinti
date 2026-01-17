import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthPayload {
    userId: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: AuthPayload;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }

        const token = authHeader.substring(7);

        try {
            const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
            req.user = payload;
            next();
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: 'Authentication error'
        });
    }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
                req.user = payload;
            } catch (error) {
                // Token invalid but continue anyway
            }
        }

        next();
    } catch (error) {
        next();
    }
};
