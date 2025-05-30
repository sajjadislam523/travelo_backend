import type { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

export const errorHandler = (
    err: HttpError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`❌ Error [${req.method}] ${req.path}:`, err);

    const statusCode = "status" in err ? err.status || 500 : 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        path: req.path,
        timestamp: new Date().toISOString(),
    });
};

export class CustomError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "CustomError";
    }
}
