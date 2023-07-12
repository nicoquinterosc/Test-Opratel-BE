import { Request, Response } from 'express-serve-static-core';
import * as UserServices from '../services/users-services';
import { UserRequest } from '../shared/types';

export async function addUser(req: Request, res: Response) {
    try {
        const userBody: UserRequest = req.body;
        const user = await UserServices.foundByUsernameEmail(userBody.username, userBody.email);
        if (user) {
            throw new Error(`Username or email already taken`);
        }

        const id: number = await UserServices.addUser(userBody);
        console.log(`User ${id} added successfully`);
        return res.status(200).json({ msg: 'User created successfully', id });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}