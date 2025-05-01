import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload, expiresIn = '1d') => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
};

export const generateRefreshToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};