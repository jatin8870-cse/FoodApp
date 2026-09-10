import User from "../models/user.model.js";
import PendingUser from "../models/panding.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail, sendOwnerOtp } from "../utils/mail.js";

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

     await PendingUser.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();


    const pendingUser = await PendingUser.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
       restOtp: otp,
     otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      isOtpVerified: false,
    });
 
     await sendOtpMail(pendingUser.email, otp);

    return res.status(201).json({ message: "Signup successful. OTP sent to your email.",
      email: pendingUser.email,});
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

     const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.restOtp = otp;
        user.otpExpiry = new Date(
            Date.now() + 5 * 60 * 1000
        );

          await user.save();

        // Send OTP
        await sendOtpMail(user.email, otp);

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
      sameSite: "none",
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
    await sendOtpMail(user.email, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Send OTP error: ${error.message}` });
  }
};

export const verifyOtpSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }
    if (pendingUser.restOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > pendingUser.otpExpiry.getTime()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
   
    const existingUser = await User.findOne({ 
      email:pendingUser.email,
     });
     if (existingUser) {
      await PendingUser.deleteOne({
        _id: pendingUser._id,
      });

      return res.status(400).json({
        message: "User already exists",
      });
    }
    
   const user = await User.create({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password,
      mobile: pendingUser.mobile,
      role: pendingUser.role,
      isOtpVerified: true
    });

    await PendingUser.deleteOne({
      _id: pendingUser._id,
    });

     const token = await genToken(pendingUser._id);

      res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
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
    if (!user || !user.isOtpVerified) {
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
};

export const googleAuthSignup = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, please sign in",
      });
    }

    const user = await User.create({
      fullName,
      email,
      mobile,
      role,
      authProvider: "google",
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      message: "Google signup successful",
      user,
    });
  } catch (error) {
    console.log("GOOGLE SIGNUP ERROR:", error);

    return res.status(500).json({
      message: `GoogleAuth error: ${error.message}`,
    });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    console.log("Google SignIn Request Body:", req.body);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    // User doesn't exist
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please sign up first.",
      });
    }

    // Generate token
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "Google signin successful",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Google signin error: ${error.message}`,
    });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp,type } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    if (user.restOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (Date.now() > user.otpExpiry.getTime()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // OTP correct
    user.isOtpVerified = true;
    user.restOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();

  if (type === "signin") {
            const token = await genToken(user._id);

            res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/"
            });


             return res.status(200).json({
                message: "Sign in successful",
                user
            });
        }

        // FORGOT PASSWORD
        if (type === "forgot-password") {
            return res.status(200).json({
                message: "OTP verified successfully"
            });
        }

  } catch (error) {
    console.error("FORGOT PASSWORD OTP ERROR:", error);

    return res.status(500).json({
      message: `Verify forgot password OTP error: ${error.message}`,
    });
  }
};

// export const becomeOwner = async (req, res) => {
//   try {
//     const { invitationCode } = req.body;

//     if (!invitationCode) {
//       return res.status(400).json({
//         message: "Invitation code is required",
//       });
//     }

//     if (invitationCode !== process.env.OWNER_INVITATION_CODE) {
//       return res.status(403).json({
//         message: "Invalid invitation code",
//       });
//     }

//     // JWT se mila hua userId use karo
//     const user = await User.findById(req.userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     if (user.role === "owner") {
//       return res.status(400).json({
//         message: "You are already an owner",
//       });
//     }

//     const otp = crypto.randomInt(100000, 1000000).toString();

//     await OwnerOtp.deleteMany({
//       user: user._id,
//     });

//     await OwnerOtp.create({
//       user: user._id,
//       otp,
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//     });

//     await sendOwnerOtp(process.env.DEVELOPER_EMAIL, otp);
//     return res.status(200).json({
//       message: "Invitation code verified",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Become owner error",
//     });
//   }
// };

// export const verifyOwnerOtp = async (req, res) => {
//   try {
//     const { otp } = req.body;

//     if (!otp) {
//       return res.status(400).json({
//         message: "OTP is required",
//       });
//     }

//     const user = await User.findById(req.userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     if (user.role === "owner") {
//       return res.status(400).json({
//         message: "You are already an owner",
//       });
//     }

//     const ownerOtp = await OwnerOtp.findOne({
//       user: user._id,
//     });

//     if (!ownerOtp) {
//       return res.status(400).json({
//         message: "OTP not found or expired",
//       });
//     }

//     if (ownerOtp.expiresAt < new Date()) {
//       await OwnerOtp.deleteOne({
//         _id: ownerOtp._id,
//       });

//       return res.status(400).json({
//         message: "OTP expired",
//       });
//     }

//     if (ownerOtp.otp !== otp) {
//       return res.status(400).json({
//         message: "Invalid OTP",
//       });
//     }

//     // Make user owner
//     user.role = "owner";
//     await user.save();

//     // OTP single use
//     await OwnerOtp.deleteOne({
//       _id: ownerOtp._id,
//     });

//     // Create login token
//     const token = await genToken(user._id);

//     const isProduction = process.env.NODE_ENV === "production";

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       message: "You are now an owner",
//       user,
//     });
//   } catch (error) {
//     console.log("VERIFY OWNER OTP ERROR:", error);

//     return res.status(500).json({
//       message: "Verify owner OTP error",
//     });
//   }
// };
