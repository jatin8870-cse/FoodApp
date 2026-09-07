import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // use SSL (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: "Reset  Your Password",
        html: `<p>Your OTP for password reset is <b> ${otp}</b> . It expires in 5 minutes.</p>`,
    })
}

export const sendOwnerOtp = async (email, otp) => {
    try {
        

        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Vingo Owner Verification OTP",
            text: `Your Vingo owner verification OTP is ${otp}. It is valid for 5 minutes.`
        });

       

    } catch (error) {
        console.log("EMAIL ERROR:", error);
        throw error;
    }
};