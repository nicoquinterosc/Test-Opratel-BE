import { NextFunction, Response, Request } from "express";
import { validationResult } from 'express-validator';

export function validate(req: Request, res: Response, next: NextFunction) {
    const entryErrors = validationResult(req);
    if (!entryErrors.isEmpty()) {
        return res.status(400).json({ errors: entryErrors.array() })
    }
    return next();
}