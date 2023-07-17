import express from 'express';
import { validate } from '../shared/utils';
import { body, param } from 'express-validator';
import * as MenusControllers from '../controllers/menus-controllers';
import { authMiddleware } from '../controllers/auth-controllers';

const router = express.Router();

router.post('/add',
    body('name').notEmpty().isString(),
    body('parentId').optional({ nullable: true }),
    body('status').optional().isNumeric(),
    validate,
    authMiddleware,
    MenusControllers.addMenu);

router.delete('/delete/:id',
    param('id').exists().isNumeric(),
    validate,
    authMiddleware,
    MenusControllers.deleteMenu);

router.put('/update/:id',
    param('id').exists().isNumeric(),
    body('name').notEmpty().isString(),
    body('parentId').optional({ nullable: true }),
    validate,
    authMiddleware,
    MenusControllers.updateMenu);

router.get('/all',
    MenusControllers.getAllMenus);

router.get('/:id',
    param('id').isNumeric(),
    validate,
    authMiddleware,
    MenusControllers.getMenu);

export default router;