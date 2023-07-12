import { PrismaClient } from '@prisma/client';
import { UserRequest } from '../shared/types';

const prisma = new PrismaClient();

export async function foundByUsernameEmail(username: string, email: string) {
    return await prisma.user.findFirst({
        where: {
            OR: [
                {
                    username: username
                },
                {
                    email: email
                }
            ]
        }
    });
}

export async function addUser(userBody: UserRequest): Promise<number> {
    const newuser = await prisma.user.create({
        data: {
            name: userBody.name,
            lastname: userBody.lastname,
            username: userBody.username,
            email: userBody.email,
            password: userBody.password,
            status: userBody.status ?? 1
        }
    })
    return newuser.id;
}
