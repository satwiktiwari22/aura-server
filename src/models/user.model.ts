import mongoose, { Model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface IUser extends Document {
    _id?: string;
    phone_number: string;
    password: string;
    name: string;
    isValidPassword(password: string): Promise<boolean>;
    generateToken(): Promise<string>;
}

const userSchema: Schema<IUser> = new Schema({
    phone_number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

  userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
    const secret = process.env.JWT_SECRET ?? 'defaultSecret';
    const expiresIn = process.env.JWT_EXPIRE ?? '1h';

    return jwt.sign({ _id: this._id }, secret, { expiresIn });
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;