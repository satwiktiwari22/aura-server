import { Request, Response } from "express";
import ApiResponse from "../utils/apiResponse.util";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { loginSchema, registerSchema } from "../validators/authValidator";
import User from "../models/user.model";

interface ValidationError extends Error {
    errors?: string[];
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, phone_number, password } = req.body;
    try{
        await registerSchema.validate({ name, phone_number, password });
    } catch (error) {
        const validationError = error as ValidationError;
        const errorMessage = validationError.errors?.join(", ") ?? "Validation failed";
        return res.status(400).json(new ApiResponse(400, null, errorMessage));
    }

    const existingUser = await User.findOne({ phone_number });

    if(existingUser){
        return res.status(400).json(new ApiResponse(400, null, "User already exists"));
    }

    try {
        const user = await User.create({ phone_number, password, name });
        if(!user){
        return res.status(500).json(new ApiResponse(500, null, "Failed to register user"));
        }
        const userData = await User.findById(user._id).select("-password");
        res.json(new ApiResponse(200, userData, "User Registered Successfully"));
    } catch (error: any) {
        if (error.code > 500) {
            return res.status(400).json(new ApiResponse(400, null, "User with this phone number already exists"));
        } else {
            return res.status(500).json(new ApiResponse(500, null, "Failed to register user"));
        }
    }
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { phone_number, password } = req.body;
    try{
        await loginSchema.validate({ phone_number, password });
    }catch (error) {
        const validationError = error as ValidationError;
        const errorMessage = validationError.errors?.join(", ") ?? "Validation failed";
        return res.status(400).json(new ApiResponse(400, null, errorMessage));
    }

    const user = await User.findOne({ phone_number });
    if(!user){
        return res.status(400).json(new ApiResponse(400, null, "User not found"));
    }

    const isMatch = await user?.isValidPassword(password);
    if(!isMatch){
        return res.status(400).json(new ApiResponse(400, null, "Password is incorrect"));
    }

    const token = await user?.generateToken();
    return res.status(200).json(new ApiResponse(200, { token, user }, "Login Successful"));
});

const getProfile = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, { user: res.locals.user }, "User Generated Successfully"));
});

export { registerUser ,loginUser, getProfile };