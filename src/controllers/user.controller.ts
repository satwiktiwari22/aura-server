import { Request, Response } from "express";
import ApiError from "../utils/apiError.utils";
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
        throw new ApiError(400, errorMessage);
    }

    const existingUser = await User.findOne({ phone_number });

    if(existingUser){
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({ name, phone_number, password });

    if(!user){
        throw new ApiError(500, "Failed to register user");
    }

    const userData = await User.findById(user._id).select("-password");

    res.json(new ApiResponse(200, userData, "User Registered Successfully"));
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { phone_number, password } = req.body;
    try{
        await loginSchema.validate({ phone_number, password });
    }catch (error) {
        const validationError = error as ValidationError;
        const errorMessage = validationError.errors?.join(", ") ?? "Validation failed";
        throw new ApiError(400, errorMessage);
    }

    const user = await User.findOne({ phone_number });
    if(!user){
        throw new ApiError(400, "User not found");
    }

    const isMatch = await user.isValidPassword(password);
    if(!isMatch){
        throw new ApiError(400, "Password is incorrect");
    }

    const token = await user.generateToken();
    res.json(new ApiResponse(200, { token }, "Login Successful"));
});

export { registerUser ,loginUser};