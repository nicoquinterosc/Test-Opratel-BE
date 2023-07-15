import { Request, Response } from 'express-serve-static-core';
import * as MenusServices from '../services/menus-services';
import { Menu, MenuRequest, MenuResponse } from '../shared/types';

export async function addMenu(req: Request, res: Response) {
    try {
        const menuBody: MenuRequest = req.body;
        const menu = await MenusServices.foundByName(menuBody.name);
        if (menu) {
            throw new Error(`Menu ${menuBody.name} already exists.`);
        }

        if (menuBody.parentId) {
            const parentMenu = await MenusServices.foundByID(menuBody.parentId);
            if (!parentMenu) {
                throw new Error(`Parent menu with id ${menuBody.parentId} not found.`);
            }
        }

        const id: number = await MenusServices.addMenu(menuBody);
        console.log(`Menu ${id} added successfully.`);
        return res.status(200).json({ msg: 'Menu created successfully.', id });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export async function deleteMenu(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const menu = await MenusServices.foundByID(id);
        if (!menu) {
            throw new Error(`Menu with id ${id} not found.`);
        }

        await MenusServices.deleteMenu(id);
        console.log(`Menu ${id} deleted successfully.`);
        return res.status(200).json({ msg: `Menu ${id} deleted successfully.` });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export async function updateMenu(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const menu = await MenusServices.foundByID(id);
        if (!menu) {
            throw new Error(`Menu with id ${id} not found.`);
        }

        const menuBody: Menu = req.body;
        const newNameMenu = await MenusServices.foundByName(menuBody.name);
        if (newNameMenu) {
            throw new Error(`Menu ${menuBody.name} already exists.`);
        }

        if (menuBody.parentId) {
            const parentMenu = await MenusServices.foundByID(menuBody.parentId);
            if (!parentMenu) {
                throw new Error(`Parent menu with id ${menuBody.parentId} not found.`);
            }
        }

        await MenusServices.updateMenu(id, menuBody.name, menuBody.parentId);
        console.log(`Menu ${id} updated successfully.`);
        return res.status(200).json({ msg: `Menu ${id} updated successfully.` });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export async function getMenu(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const menu = <MenuRequest>await MenusServices.foundByID(id);
        if (!menu) {
            throw new Error(`Menu with id ${id} not found.`);
        }

        return res.status(200).json(menu);

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export async function getAllMenus(req: Request, res: Response) {
    try {
        const filter: string | null = req.query.filter?.toString() ?? null;
        const menus: MenuResponse[] = await MenusServices.getAllMenus(filter);
        return res.status(200).json({ menus });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}