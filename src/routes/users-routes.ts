import express from 'express';
import { validate } from '../shared/utils';
import { body, param } from 'express-validator';
import * as UsersControllers from '../controllers/users-controllers';
import { authMiddleware } from '../controllers/auth-controllers';

const router = express.Router();

router.post('/add',
    body('name').notEmpty().isString(),
    body('username').notEmpty().isString(),
    body('lastname').notEmpty().isString(),
    body('email').notEmpty().isString().isEmail(),
    body('password').notEmpty().isString(),
    body('status').optional().isNumeric(),
    validate,
    authMiddleware,
    UsersControllers.addUser);

router.delete('/delete/:id',
    param('id').exists().isNumeric(),
    validate,
    authMiddleware,
    UsersControllers.deleteUser);

router.put('/update/:id',
    param('id').exists().isNumeric(),
    body('name').optional().isString(),
    body('username').optional().isString(),
    body('lastname').optional().isString(),
    body('email').optional().isString().isEmail(),
    body('password').optional().isString(),
    validate,
    authMiddleware,
    UsersControllers.updateUser);

router.get('/all',
UsersControllers.getAllUsers);

router.get('/:id/menus',
    authMiddleware,
    UsersControllers.getUserMenus);

router.get('/:id',
    param('id').isNumeric(),
    validate,
    authMiddleware,
    UsersControllers.getUser);

router.post('/:id/menus',
    body('menuIds').notEmpty().isArray(),
    validate,
    authMiddleware,
    UsersControllers.addMenuToUser);

export default router;