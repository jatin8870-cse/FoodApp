import { Resend } from "resend";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import brevo from "../utils/brevo.js";

dotenv.config();

export const sendOtpMail = async (to, otp) => {
    try {
        const result = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: process.env.BREVO_FROM_NAME,
                email: process.env.BREVO_FROM_EMAIL,
            },

            to: [
                {
                    email: to,
                },
            ],

            subject: "Reset Your Password",

            htmlContent: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Vingo Password Reset</h2>

                    <p>Your OTP for password reset is:</p>

                    <h1 style="letter-spacing: 5px;">
                        ${otp}
                    </h1>

                    <p>This OTP is valid for 5 minutes.</p>

                    <p>
                        If you did not request a password reset,
                        please ignore this email.
                    </p>
                </div>
            `,
        });

        console.log("OTP EMAIL SENT:", result.messageId);

        return result;

    } catch (error) {
        console.error("BREVO OTP ERROR:", error);
        throw error;
    }
};

export const sendOwnerOtp = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [email],
      subject: "Vingo Owner Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Vingo Owner Verification</h2>

          <p>Your owner verification OTP is:</p>

          <h1 style="letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>This OTP is valid for 5 minutes.</p>

          <p>If you did not request owner verification, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND OWNER OTP ERROR:", error);
      throw new Error(error.message);
    }

    return data;

  } catch (error) {
    console.error("SEND OWNER OTP ERROR:", error);
    throw error;
  }
};