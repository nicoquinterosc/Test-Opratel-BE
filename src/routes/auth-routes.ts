import express from 'express';
import * as AuthControllers from '../controllers/auth-controllers';
import { validate } from '../shared/utils';
import { body } from 'express-validator';

const router = express.Router();

router.post('/login',
    body('username').notEmpty().isString(),
    body('password').notEmpty().isString(),
    validate,
    AuthControllers.login);

export default router;