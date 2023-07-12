import express from 'express';
import { validate } from '../shared/utils';
import { body, param } from 'express-validator';
import * as MenusController from '../controllers/menus-controllers';

const router = express.Router();

router.post('/add',
    body('name').notEmpty().isString(),
    body('parentId').optional().isNumeric(),
    body('status').optional().isNumeric(),
    validate,
    MenusController.addMenu);

router.delete('/delete/:id',
    param('id').exists().isNumeric(),
    validate,
    MenusController.deleteMenu);

router.put('/update/:id',
    param('id').exists().isNumeric(),
    body('name').notEmpty().isString(),
    body('parentId').optional().isNumeric(),
    validate,
    MenusController.updateMenu);

router.get('/all',
    MenusController.getAllMenus);

router.get('/:id',
    param('id').isNumeric(),
    validate,
    MenusController.getMenu);

export default router;