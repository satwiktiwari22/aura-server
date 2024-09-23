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
    const { name, email, password } = req.body;
    try{
        await registerSchema.validate({ name, email, password });
    } catch (error) {
        const validationError = error as ValidationError;
        const errorMessage = validationError.errors?.join(", ") || "Validation failed";
        throw new ApiError(400, errorMessage);
    }

    const existingUser = await User.findOne({ email });

    if(existingUser){
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({ name, email, password });

    if(!user){
        throw new ApiError(500, "Failed to register user");
    }

    const userData = await User.findById(user._id).select("-password");

    res.json(new ApiResponse(200, userData, "User Registered Successfully"));
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    //1. Get data from frontend
    //2. validation
    //3. Check if user with this email exists
    //4. Compare password
    //5. Create Token
    //6. Send Token in response
    const { email, password } = req.body;
    try{
        await loginSchema.validate({ email, password });
    }catch (error) {
        const validationError = error as ValidationError;
        const errorMessage = validationError.errors?.join(", ") || "Validation failed";
        throw new ApiError(400, errorMessage);
    }

    const user = await User.findOne({ email });
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