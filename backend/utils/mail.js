import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM;

export const sendOtpMail = async (to, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Reset Your Password - Vingo",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Vingo - Password Reset</h2>

          <p>Your OTP for password reset is:</p>

          <h1 style="letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>This OTP will expire in 5 minutes.</p>

          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND OTP ERROR:", error);
      throw new Error(error.message);
    }


    return data;

  } catch (error) {
    console.error("SEND OTP MAIL ERROR:", error);
    throw error;
  }
};


export const sendOwnerOtp = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
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

    console.log("OWNER OTP EMAIL SENT:", data);

    return data;

  } catch (error) {
    console.error("SEND OWNER OTP ERROR:", error);
    throw error;
  }
};