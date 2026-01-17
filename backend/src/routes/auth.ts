import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import {
    hashValue,
    compareHash,
    generateAccessToken,
    generateRefreshToken,
    generateOTP,
    generateOTPExpiry,
    isOTPExpired,
    verifyToken,
} from '../utils/auth';

const router = Router();

// POST /api/auth/register
// Step 1: Register new user with CIN
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { cinNumber, phoneNumber, fullName } = req.body;

        // Validation
        if (!cinNumber || !phoneNumber) {
            return res.status(400).json({
                status: 'error',
                message: 'CIN and phone number are required',
            });
        }

        // Check if user already exists
        const cinHash = await hashValue(cinNumber);
        const phoneHash = await hashValue(phoneNumber);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ cinHash }, { phoneHash }],
            },
        });

        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'User with this CIN or phone number already exists',
            });
        }

        // Generate OTP
        const otpCode = generateOTP();
        const otpExpiresAt = generateOTPExpiry();

        // Create user (pending verification)
        const user = await prisma.user.create({
            data: {
                cinNumber, // Store for now, will hash after verification
                cinHash,
                phoneNumber,
                phoneHash,
                fullName: fullName || null,
                phoneVerified: false,
                otpCode,
                otpExpiresAt,
                otpAttempts: 0,
            },
        });

        // TODO: Send OTP via SMS (Twilio integration)
        console.log(`📱 OTP for ${phoneNumber}: ${otpCode}`);

        return res.status(201).json({
            status: 'success',
            message: 'OTP sent to your phone number',
            data: {
                userId: user.id,
                expiresIn: 300, // 5 minutes
            },
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

// POST /api/auth/verify-otp
// Step 2: Verify OTP and activate account
router.post('/verify-otp', async (req: Request, res: Response) => {
    try {
        const { userId, otpCode } = req.body;

        if (!userId || !otpCode) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID and OTP code are required',
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        // Check OTP attempts
        if (user.otpAttempts >= 3) {
            return res.status(429).json({
                status: 'error',
                message: 'Too many failed attempts. Please request a new OTP.',
            });
        }

        // Check if OTP expired
        if (!user.otpExpiresAt || isOTPExpired(user.otpExpiresAt)) {
            return res.status(400).json({
                status: 'error',
                message: 'OTP has expired. Please request a new one.',
            });
        }

        // Verify OTP
        if (user.otpCode !== otpCode) {
            // Increment attempts
            await prisma.user.update({
                where: { id: userId },
                data: { otpAttempts: user.otpAttempts + 1 },
            });

            return res.status(400).json({
                status: 'error',
                message: 'Invalid OTP code',
            });
        }

        // OTP verified - activate user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                phoneVerified: true,
                otpCode: null,
                otpExpiresAt: null,
                otpAttempts: 0,
                lastLogin: new Date(),
            },
        });

        // Generate JWT tokens
        const accessToken = generateAccessToken({
            userId: updatedUser.id,
            role: updatedUser.role,
        });

        const refreshToken = generateRefreshToken({
            userId: updatedUser.id,
            role: updatedUser.role,
        });

        return res.json({
            status: 'success',
            message: 'Phone verified successfully',
            data: {
                accessToken,
                refreshToken,
                user: {
                    id: updatedUser.id,
                    phoneNumber: updatedUser.phoneNumber,
                    fullName: updatedUser.fullName,
                    role: updatedUser.role,
                },
            },
        });
    } catch (error: any) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

// POST /api/auth/login
// Step 1: Login with CIN
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { cinNumber } = req.body;

        if (!cinNumber) {
            return res.status(400).json({
                status: 'error',
                message: 'CIN number is required',
            });
        }

        // Find user by CIN
        const user = await prisma.user.findUnique({
            where: { cinNumber },
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found. Please register first.',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is deactivated',
            });
        }

        // Generate OTP
        const otpCode = generateOTP();
        const otpExpiresAt = generateOTPExpiry();

        // Update user with OTP
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otpCode,
                otpExpiresAt,
                otpAttempts: 0,
            },
        });

        // TODO: Send OTP via SMS
        console.log(`📱 OTP for ${user.phoneNumber}: ${otpCode}`);

        return res.json({
            status: 'success',
            message: 'OTP sent to your registered phone number',
            data: {
                userId: user.id,
                expiresIn: 300,
            },
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

// POST /api/auth/refresh
// Refresh access token using refresh token
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                status: 'error',
                message: 'Refresh token is required',
            });
        }

        const payload = verifyToken(refreshToken);

        if (!payload) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid refresh token',
            });
        }

        // Generate new access token
        const accessToken = generateAccessToken({
            userId: payload.userId,
            role: payload.role,
        });

        return res.json({
            status: 'success',
            data: {
                accessToken,
            },
        });
    } catch (error: any) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

// POST /api/auth/resend-otp
// Resend OTP if expired
router.post('/resend-otp', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required',
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        // Generate new OTP
        const otpCode = generateOTP();
        const otpExpiresAt = generateOTPExpiry();

        await prisma.user.update({
            where: { id: userId },
            data: {
                otpCode,
                otpExpiresAt,
                otpAttempts: 0,
            },
        });

        // TODO: Send OTP via SMS
        console.log(`📱 New OTP for ${user.phoneNumber}: ${otpCode}`);

        return res.json({
            status: 'success',
            message: 'New OTP sent',
            data: {
                expiresIn: 300,
            },
        });
    } catch (error: any) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

// POST /api/auth/admin-login
// Login with email and password (for admins)
router.post('/admin-login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required',
            });
        }

        const cleanEmail = email.toLowerCase().trim();
        const cleanPassword = password.trim();

        console.log(`[AUTH-DEBUG] Login attempt: email="${cleanEmail}"`);

        // Find admin user
        const user = await prisma.user.findFirst({
            where: { email: cleanEmail },
        });

        if (!user) {
            console.log(`[AUTH-DEBUG] ERROR: User not found for email: "${cleanEmail}"`);
            return res.status(401).json({
                status: 'error',
                message: 'Identifiants invalides',
            });
        }

        console.log(`[AUTH-DEBUG] SUCCESS: User found. ID: ${user.id}, Role: ${user.role}`);

        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            console.log(`[AUTH-DEBUG] ERROR: Role mismatch. User has role: ${user.role}`);
            return res.status(401).json({
                status: 'error',
                message: 'Accès réservé aux administrateurs',
            });
        }

        if (!user.password) {
            console.log(`[AUTH-DEBUG] ERROR: User has NO password stored in database!`);
            return res.status(401).json({
                status: 'error',
                message: 'Compte non configuré pour la connexion par mot de passe',
            });
        }

        // Verify password
        console.log(`[AUTH-DEBUG] Comparing passwords... Hash in DB starts with: ${user.password.substring(0, 10)}... (length: ${user.password.length})`);
        const isPasswordValid = await compareHash(cleanPassword, user.password);
        console.log(`[AUTH-DEBUG] Result of compareHash: ${isPasswordValid}`);

        if (!isPasswordValid) {
            console.log(`[AUTH-DEBUG] ERROR: Password mismatch for ${user.email}`);
            return res.status(401).json({
                status: 'error',
                message: 'Mot de passe incorrect',
            });
        }

        console.log(`[AUTH-DEBUG] COMPLETED: Password valid. Generating tokens...`);

        // Generate JWT tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
            role: user.role,
        });

        res.json({
            status: 'success',
            data: {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                },
            },
        });
    } catch (error: any) {
        console.error('Admin login error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

export default router;
