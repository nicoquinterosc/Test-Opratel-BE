import express from 'express';
import { validate } from '../shared/utils';
import { body } from 'express-validator';
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

export default router;