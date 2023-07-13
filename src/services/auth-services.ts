import * as jwt from 'jsonwebtoken'
import { foundByUsername } from './users-services';
import * as dotenv from 'dotenv';
dotenv.config();

export async function validateCredentials(username: string, password: string): Promise<{ check: boolean, token: string }> {
    let authenticated = false;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        authenticated = true;
    } else {
        const user = await foundByUsername(username);
        if (user && user.password === password) {
            authenticated = true;
        }
    }

    if (authenticated) {
        const token = generateToken();
        return { check: true, token: token };
    }
    return { check: false, token: "" };
}

function generateToken(): string {
    const payload = {
        check: true
    };
    if (!process.env.SECRET_KEY) {
        throw new Error('The SECRET environment variable is not set.')
    }
    const secret: jwt.Secret = process.env.SECRET_KEY;
    return jwt.sign(payload, secret);
}

export function validateToken(token: string) {
    if (!process.env.SECRET_KEY) {
        throw new Error('The SECRET environment variable is not set.')
    }
    const secret: jwt.Secret = process.env.SECRET_KEY;
    return jwt.verify(token, secret);
}