import User from "@/models/user.models"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { AuthOptions } from "next-auth"
import connectDB from "@/lib/connectDb"

export const authOptions:AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any> {
                await connectDB()
                const user = await User.findOne({
                    $or: [
                        {email: credentials?.email},
                        {username: credentials?.email}
                    ]
                })
                if(!user){
                    return null
                }

                if(!user.isVerified){
                    throw new Error("Please verify your account")
                }

                const isPasswordCorrect = bcrypt.compare(credentials.password, user.password )
                if(!isPasswordCorrect){
                    throw new Error("Incorrect Password")
                }
                return user
            },
        })
    ],
    callbacks: {
    async session({ session, token, user }) {
        if(user){
            token._id = user._id.toString()
            token.isVerified = user.isVerified
            token.acceptMessages = user.acceptMessages
            token.username = user.username

            session.user._id = user._id.toString()
            session.user.isVerified = user.isVerified
            session.user.acceptMessages = user.acceptMessages
            session.user.username = user.username
        }
        return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
        return token
    }
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in'
    }
}