import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail,sendOwnerOtp } from "../utils/mail.js";
import crypto from "crypto";
import OwnerOtp from "../models/ownerotp.js";
const isProduction = process.env.NODE_ENV === "production";
export const singUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (mobile.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 10 digits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role
    });

    const token = await genToken(user._id);
   res.cookie("token", token, {
 httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Sing up error: ${error.message}` });
  }
};

export const singIn = async (req, res) => {
  try {
          

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
  httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Sing in error: ${error.message}` });
  }
};

export const signOut = async (req, res) => {
  try {
   res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    return res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Sign out error: ${error.message}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.restOtp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    sendOtpMail(user.email, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Send OTP error: ${error.message}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
   if (user.restOtp !== otp) {
  return res.status(400).json({ message: "Invalid OTP" });
}

if (Date.now() > user.otpExpiry) {
  return res.status(400).json({ message: "OTP has expired" });
}
    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    user.isOtpVerified = true;
    user.restOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Verify OTP error: ${error.message}` });
  }
};


export const resetPassword = async (req, res) => {
    try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user  || !user.isOtpVerified) {
        return res.status(400).json({ message: "OTP verification required" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Reset Password error: ${error.message}` });
    }
}

export  const googleAuth = async (req,res)  => {
  try{
   const {fullName,email,mobile,role} = req.body
   let user = await User.findOne({email})
   if(!user){
       user=await User.create({
        fullName,
        email,
        mobile,
        role,
         authProvider: "google"
       })
   }

    const token = await genToken(user._id);
    res.cookie("token", token, {
  secure: true,
  sameSite: "none",
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    return res.status(201).json(user);

  } catch(error){
      return  res.status(500)
            .json({ message: `GoogleAuth error: ${error.message}` });
  }
}

export const becomeOwner = async (req, res) => {
    try {

        console.log("BECOME OWNER USER ID:", req.userId);

        const { invitationCode } = req.body;

        if (!invitationCode) {
            return res.status(400).json({
                message: "Invitation code is required"
            });
        }

        if (invitationCode !== process.env.OWNER_INVITATION_CODE) {
            return res.status(403).json({
                message: "Invalid invitation code"
            });
        }

        // JWT se mila hua userId use karo
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "owner") {
            return res.status(400).json({
                message: "You are already an owner"
            });
        }

        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        await OwnerOtp.deleteMany({
            user: user._id
        });

        await OwnerOtp.create({
            user: user._id,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendOwnerOtp(user.email, otp);

        return res.status(200).json({
            message: "Invitation code verified"
        });

    } catch (error) {

        console.log("BECOME OWNER ERROR:", error);

        return res.status(500).json({
            message: "Become owner error"
        });
    }
};

export const verifyOwnerOtp = async (req, res) => {
    try {

        console.log("VERIFY OWNER USER ID:", req.userId);

        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                message: "OTP is required"
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "owner") {
            return res.status(400).json({
                message: "You are already an owner"
            });
        }

        const ownerOtp = await OwnerOtp.findOne({
            user: user._id
        });

        if (!ownerOtp) {
            return res.status(400).json({
                message: "OTP not found or expired"
            });
        }

        if (ownerOtp.expiresAt < new Date()) {

            await OwnerOtp.deleteOne({
                _id: ownerOtp._id
            });

            return res.status(400).json({
                message: "OTP expired"
            });
        }

        if (ownerOtp.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // Make user owner
        user.role = "owner";
        await user.save();

        // OTP single use
        await OwnerOtp.deleteOne({
            _id: ownerOtp._id
        });

        // Create login token
        const token = await genToken(user._id);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "You are now an owner",
            user
        });

    } catch (error) {

        console.log("VERIFY OWNER OTP ERROR:", error);

        return res.status(500).json({
            message: "Verify owner OTP error"
        });
    }
};