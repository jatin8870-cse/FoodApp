import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

   password: {
    type: String,
    required: function () {
        return this.authProvider === "local";
    }
},

authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
},

    mobile: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "owner", "deliveryboy"],
      required: true,
    },

    restOtp: {
      type: String,
    },

    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpiry: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
