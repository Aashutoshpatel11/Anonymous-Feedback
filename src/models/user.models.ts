import mongoose, {Schema, Document} from "mongoose";
import { Content } from "next/font/google";

export interface messageInterface extends Document{
    content: string,
    createdAt: Date
}

const messageSchema: Schema<messageInterface> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    }
})

export interface userInterface extends Document{
    username: string,
    email: string,
    password: string,
    messages: messageInterface[],
    verifyToken: string,
    verifyTokenExpiry: Date,
    isVerified: boolean,
    acceptMessages: boolean,
}

const userSchema: Schema<userInterface> = new Schema({
    username: {
        type: String,
        required: [true, "Fullname is Required"],
        match: [/^[a-zA-Z0-9]+$/, "Use valid username"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, "Provide valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        unique: true
    },
    messages: [messageSchema],
    verifyToken: {
        type: String,
        required: [true, "Verify token is required"],
        length: [6, "Verify token should be of 6 characters"]
    },
    verifyTokenExpiry: {
        type: Date,
        required: [true, "Verify token expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    acceptMessages: {
        type: Boolean,
        default: false
    },
})

const UserModel = mongoose.models.User as mongoose.Model<userInterface> || mongoose.model<userInterface>("User", userSchema)

export default UserModel