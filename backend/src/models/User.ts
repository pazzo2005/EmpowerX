import { Document, Schema, model, Types } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
  _id: Types.ObjectId;  // Explicitly type the _id field
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }  // Adds createdAt and updatedAt automatically
);

// Create and export the model
const User = model<IUser>('User', userSchema);

export default User;