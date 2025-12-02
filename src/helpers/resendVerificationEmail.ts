import React from 'react';
import { Resend } from 'resend';
import VerificationEmail from '../../emails/VerificationEmail';

interface verificationrequestInterface{
    username: string,
    email: string,
    verificationCode: string
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail({username, email, verificationCode}:verificationrequestInterface) {
    try {
        const {data, error} = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Email for verification',
        react: VerificationEmail({username, otp:verificationCode})
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);  
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

export default sendVerificationEmail