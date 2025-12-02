import connectDB from "@/lib/connectDb";
import User from "@/models/user.models";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { apiResponse } from "@/types/apiResponse";
import sendVerificationEmail from "@/helpers/resendVerificationEmail";

export async function POST(request:Request){
    await connectDB()

    try {
        const {username, email, password} = await request.json()

        const existingUser = await User.findOne({email: email})
        const hashedPasswornd = await bcrypt.hash(password, 10)
        const verifyToken = Math.floor(Math.random()*1000000).toString()
        const verifyTokenExpiry = new Date(Date.now() + 600000)

        if(existingUser){
            if (existingUser.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Username already exists"
                    },
                    {
                        status: 400
                    }
                )
            } else {
                existingUser.username = username
                existingUser.password = hashedPasswornd
                existingUser.verifyToken = verifyToken
                existingUser.verifyTokenExpiry = verifyTokenExpiry

                await existingUser.save({validateBeforeSave: false})
            }
        }else{
            const newUser = new User({
                username,
                email,
                password: hashedPasswornd,
                messages: [],
                verifyToken,
                verifyTokenExpiry,
                isVerified: false,
                acceptMessages: true,
            })

            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail({email, username, verificationCode:verifyToken})

        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },{
                    status: 501
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify email address"
            },{
                status: 201
            }
        )

    } catch (error) {
        console.log("Error creating user::", error);
        throw error
    }
}