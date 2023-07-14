import * as jwt from 'jsonwebtoken'
import { foundByUsername } from './users-services';
import * as dotenv from 'dotenv';
dotenv.config();

export async function validateCredentials(username: string, password: string): Promise<{ check: boolean, firstName: string, lastName: string, token: string }> {
    let authenticated = false;
    let firstName = '';
    let lastName = '';

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        authenticated = true;
        firstName = 'Admin';
    } else {
        const user = await foundByUsername(username);
        if (user && user.password === password) {
            authenticated = true;
            firstName = user.name;
            lastName = user.lastname;
        }
    }

    if (authenticated) {
        const token = generateToken();
        return { check: true, firstName: firstName, lastName: lastName, token: token };
    }
    return { check: false, firstName: '', lastName: '', token: '' };
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