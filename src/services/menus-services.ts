import { PrismaClient } from '@prisma/client';
import { Menu, MenuRequest, MenuResponse } from '../shared/types';

const prisma = new PrismaClient();

let filteredMenus: MenuResponse[] = [];

export async function foundByName(name: string) {
    return await prisma.menu.findUnique({
        where: {
            name: name,
        }
    });
}

export async function foundByID(id: number) {
    return await prisma.menu.findFirst({
        where: {
            id: id,
            status: 1
        }
    });
}

export async function addMenu(menuBody: MenuRequest): Promise<number> {
    const newMenu = await prisma.menu.create({
        data: {
            name: menuBody.name,
            parentId: menuBody.parentId ?? null,
            status: menuBody.status ?? 1
        }
    })
    return newMenu.id;
}

export async function deleteMenu(id: number) {
    await deleteChildren(id);
    return await prisma.menu.update({
        where: {
            id: id,
        },
        data: {
            status: 0,
        },
    });
}

async function deleteChildren(parentId: number) {
    const childrenMenus = <Menu[]>await prisma.menu.findMany({
        where: {
            parentId: parentId,
        }
    });

    for (const childrenMenu of childrenMenus) {
        await prisma.menu.update({
            where: {
                id: childrenMenu.id,
            },
            data: {
                status: 0,
            }
        });
        await deleteChildren(childrenMenu.id!);
    }
}

export async function updateMenu(id: number, name: string, parentId: number | null) {
    return await prisma.menu.update({
        where: {
            id: id,
        },
        data: {
            name: name,
            parentId: parentId ?? null
        }
    });
}

export async function getAllMenus(filter: string | null): Promise<MenuResponse[]> {

    let menusRaw = await prisma.menu.findMany({
        where: {
            status: 1,
        }
    });

    const menus: MenuResponse[] = menusRaw.map(menu => {
        const { status, ...menuResponse } = menu;
        return menuResponse;
    });

    const menuMap: { [id: number]: MenuResponse } = {};

    for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        const parentId = menu.parentId;
        if (!menu.children) {
            menu.children = [];
        }
        if (parentId) {
            const parentMenu = menuMap[parentId];

            if (parentMenu) {
                if (!parentMenu.children) {
                    parentMenu.children = [];
                }
                parentMenu.children.push(menu);
            } else {
                menus.push(...menus.splice(i, 1));
                i--;
            }
        }

        menuMap[menu.id!] = menu;
    }

    let topLevelMenus = menus.filter(menu => !menu.parentId);
    if (filter) {
        filteredMenus = [];
        topLevelMenus = filterMenus(topLevelMenus, filter);
        topLevelMenus = sortMenus(topLevelMenus);
    }
    return topLevelMenus;
}

function filterMenus(menus: MenuResponse[], filter: string): MenuResponse[] {

    for (const menu of menus) {
        if (menu.name.includes(filter)) {
            filteredMenus.push(menu);
        } else {
            if (menu.children?.length) {
                filterMenus(menu.children || [], filter);
            }
        }
    }

    return filteredMenus;
}

function sortMenus(menus: MenuResponse[]): MenuResponse[] {
    return menus.sort((a, b) => {
        if (a.parentId === null && b.parentId !== null) {
            return -1;
        } else if (a.parentId !== null && b.parentId === null) {
            return 1;
        } else {
            return 0;
        }
    });
}