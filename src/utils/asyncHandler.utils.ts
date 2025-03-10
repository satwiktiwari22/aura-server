import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    code?: number;
}

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        const customError = error as CustomError;
        res.status(customError.code || 500).json({
            message: customError.message || "An unknown error occurred!",
            success: false,
        });
    }
};