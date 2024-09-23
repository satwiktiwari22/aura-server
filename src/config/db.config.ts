import mongoose from "mongoose";
const DB_Name = "smarthome";
export const connectDB = async () => {
    try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`);
    console.log(`Database Connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Database Connection Error: ", error);
        process.exit(1);
    }
};