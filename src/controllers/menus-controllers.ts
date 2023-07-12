import { Request, Response } from 'express-serve-static-core';
import * as MenuServices from '../services/menus-services';
import { MenuRequest, MenuResponse } from '../shared/types';

export async function addMenu(req: Request, res: Response) {
    try {
        const menuBody: MenuRequest = req.body;
        const menu = await MenuServices.foundByName(menuBody.name);
        if (menu) {
            throw new Error(`Menu ${menuBody.name} already exists`);
        }

        if (menuBody.parentId) {
            const parentMenu = await MenuServices.foundByID(menuBody.parentId);
            if (!parentMenu) {
                throw new Error(`Parent menu with id ${menuBody.parentId} not found`);
            }
        }

        const id: number = await MenuServices.addMenu(menuBody);
        console.log(`Menu ${id} added successfully`);
        return res.status(200).json({ msg: 'Menu created successfully', id });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export async function deleteMenu(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const menu = await MenuServices.foundByID(id);
        if (!menu) {
            throw new Error(`Menu with id ${id} not found`);
        }

        await MenuServices.deleteMenu(id);
        console.log(`Menu ${id} deleted successfully`);
        return res.status(200).json({ msg: `Menu ${id} deleted successfully` });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export async function updateMenu(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const menu = await MenuServices.foundByID(id);
        if (!menu) {
            throw new Error(`Menu with id ${id} not found`);
        }

        let { name, parentId } = req.body;
        const newNameMenu = await MenuServices.foundByName(name);
        if (newNameMenu) {
            throw new Error(`Menu ${name} already exists`);
        }

        if (!parentId) {
            parentId = menu.parentId;
        } else {
            const parentMenu = await MenuServices.foundByID(parentId);
            if (!parentMenu) {
                throw new Error(`Parent menu with id ${parentId} not found`);
            }
        }

        await MenuServices.updateMenu(id, name, parentId);
        console.log(`Menu ${id} updated successfully`);
        return res.status(200).json({ msg: `Menu ${id} updated successfully` });

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}

export async function getMenu(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const menu = <MenuRequest>await MenuServices.foundByID(id);
        if (!menu) {
            throw new Error(`Menu with id ${id} not found`);
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
        const menus: MenuResponse[] = await MenuServices.getAllMenus(filter);
        return res.status(200).json(menus);

    } catch (e) {
        console.error(e.message);
        return res.status(400).json(e.message);
    }
}