import User from "../models/user.model";
import ApiResponse from "../utils/apiResponse.util";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json(new ApiResponse(401, null, "Unauthorized request"));
        return;
    }

    const secret = process.env.JWT_SECRET || 'defaultSecret';

    try {
        const decodedToken = jwt.verify(token, secret) as { _id: string };

        const user = await User.findById(decodedToken._id).select("-password");

        if (!user) {
            res.status(401).json(new ApiResponse(401, null, "Invalid token"));
            return;
        }

        res.locals.user = user;
        return next();
    } catch (error) {
        res.status(401).json(new ApiResponse(401, error, "Invalid token"));
        return;
    }
});

export default verifyJWT;
