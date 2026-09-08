import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});


const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM;

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset Your Password",
    html: `
      <p>
        Your OTP for password reset is 
        <b>${otp}</b>.
        It expires in 5 minutes.
      </p>
    `,
  });
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