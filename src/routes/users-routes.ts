import express from 'express';
import { validate } from '../shared/utils';
import { body, param } from 'express-validator';
import * as UsersController from '../controllers/users-controllers';

const router = express.Router();

router.post('/add',
    body('name').notEmpty().isString(),
    body('username').notEmpty().isString(),
    body('lastname').notEmpty().isString(),
    body('email').notEmpty().isString().isEmail(),
    body('password').notEmpty().isString(),
    body('status').optional().isNumeric(),
    validate,
    UsersController.addUser);

router.delete('/delete/:id',
    param('id').exists().isNumeric(),
    validate,
    UsersController.deleteUser);

router.put('/update/:id',
    param('id').exists().isNumeric(),
    body('name').optional().isString(),
    body('username').optional().isString(),
    body('lastname').optional().isString(),
    body('email').optional().isString().isEmail(),
    body('password').optional().isString(),
    validate,
    UsersController.updateUser);

export default router;