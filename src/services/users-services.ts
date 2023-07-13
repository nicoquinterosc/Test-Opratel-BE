import { PrismaClient } from '@prisma/client';
import { User, UserRequest, UserMenu } from '../shared/types';
import { getAllMenus } from './menus-services';

const prisma = new PrismaClient();

export async function foundByUsername(username: string) {
    return await prisma.user.findUnique({
        where: {
            username: username,
        }
    });
}

export async function foundByEmail(email: string) {
    return await prisma.user.findUnique({
        where: {
            email: email,
        }
    });
}

export async function foundByID(id: number) {
    return await prisma.user.findFirst({
        where: {
            id: id,
            status: 1
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

export async function deleteUser(id: number) {
    return await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            status: 0,
        },
    });
}

export function validateBody(body: User): boolean {
    if (!body.name && !body.lastname && !body.email && !body.password && !body.username) {
        return false;
    }
    return true;
}

export async function updateUser(user: User) {
    return await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            username: user.username,
            password: user.password
        }
    });
}

export async function getUserMenus(userId: number, filter: string | null) {
    const userMenusIds = <UserMenu[]>await getUserMenusIds(userId);
    const menuIds = userMenusIds.map(userMenuId => userMenuId.menuId);
    return await getAllMenus(filter, menuIds);
}

async function getUserMenusIds(userId: number) {
    return await prisma.menusToUser.findMany({
        where: {
            userId: userId
        }
    });
}

export async function addMenuToUser(userId: number, menuId: number) {
    return await prisma.menusToUser.create({
        data: {
            userId: userId,
            menuId: menuId
        }
    });
}