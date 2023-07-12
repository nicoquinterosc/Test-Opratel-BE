import { Request, Response } from 'express-serve-static-core';
import * as UsersServices from '../services/users-services';
import { User, UserRequest } from '../shared/types';

export async function addUser(req: Request, res: Response) {
    try {
        const userBody: UserRequest = req.body;
        let user = await UsersServices.foundByUsername(userBody.username);
        if (user) {
            throw new Error(`Username already taken`);
        }
        user = await UsersServices.foundByEmail(userBody.email);
        if (user) {
            throw new Error(`Email already taken`);
        }

        const id: number = await UsersServices.addUser(userBody);
        console.log(`User ${id} added successfully`);
        return res.status(200).json({ msg: 'User created successfully', id });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const user = await UsersServices.foundByID(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        await UsersServices.deleteUser(id);
        console.log(`User ${id} deleted successfully`);
        return res.status(200).json({ msg: `User ${id} deleted successfully` });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const user = await UsersServices.foundByID(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        const userBody: User = req.body;
        userBody.id = id;
        if (!UsersServices.validateBody(userBody)) {
            throw new Error(`No value to update`);
        }
        if (userBody.username) {
            const newUsernameUser = await UsersServices.foundByUsername(userBody.username);
            if (newUsernameUser) {
                throw new Error(`Username ${userBody.username} already taken`);
            }
        } else {
            userBody.username = user.username;
        }
        if (userBody.email) {
            const newEmailUser = await UsersServices.foundByEmail(userBody.email);
            if (newEmailUser) {
                throw new Error(`Email ${userBody.email} already taken`);
            }
        } else {
            userBody.email = user.email;
        }
        if (!userBody.name) {
            userBody.name = user.name;
        }
        if (!userBody.lastname) {
            userBody.lastname = user.lastname;
        }
        if (!userBody.password) {
            userBody.password = user.password;
        }

        await UsersServices.updateUser(userBody);
        console.log(`User ${id} updated successfully`);
        return res.status(200).json({ msg: `User ${id} updated successfully` });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}