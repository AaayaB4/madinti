import { Router } from 'express';

const router = Router();

// TODO: Implement authentication routes
// POST /api/auth/register - Register new user
// POST /api/auth/login - Login user
// POST /api/auth/otp - Send OTP
// POST /api/auth/verify-otp - Verify OTP

router.post('/register', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/login', (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
