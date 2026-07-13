import type{ Request, Response, NextFunction } from "express";

const asyncHandler = (requestHandler: any) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch(next);
    }
};

export {asyncHandler};