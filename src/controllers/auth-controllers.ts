import { Request, Response, NextFunction } from 'express-serve-static-core';
import * as AuthServices from '../services/auth-services';

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const result: { check: boolean, token: string } = await AuthServices.validateCredentials(username, password);
        if (result.check) {
            return res.status(200).json({ msg: 'Login successful', token: result.token });
        }
        return res.status(401).json({ msg: 'Invalid credentials', token: result.token });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ msg: 'Token not found' });
    }
    if (token.startsWith("Bearer") || token.startsWith("bearer")) {
        token = token.slice(7, token.length);
    }
    if (token) {
        try {
            AuthServices.validateToken(token);
        } catch (e) {
            return res.status(401).json({ msg: 'Invalid token' });
        }
    }
    return next();
}
