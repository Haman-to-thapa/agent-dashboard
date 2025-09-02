import { Schema, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
