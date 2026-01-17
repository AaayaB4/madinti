import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export interface TokenPayload {
    userId: string;
    role: string;
}

// Generate access token (short-lived)
export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

//Generate refresh token (long-lived)
export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
};

// Verify token
export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};

// Hash password/CIN
export const hashValue = async (value: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
};

// Compare hash
export const compareHash = async (value: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(value, hash);
};

// Generate OTP code
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate OTP expiry (5 minutes from now)
export const generateOTPExpiry = (): Date => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now;
};

// Check if OTP is expired
export const isOTPExpired = (expiresAt: Date): boolean => {
    return new Date() > expiresAt;
};
