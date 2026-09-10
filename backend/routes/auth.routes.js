import express from "express";
import { singUp, singIn, signOut } from "../controllers/auth.controllers.js";
import { sendOtp, verifyOtp, resetPassword,googleAuthSignup,googleSignIn,verifyOtpSignup} from "../controllers/auth.controllers.js";


const authRouter = express.Router();

authRouter.get("/test", (req, res) => {
    res.send("Auth router working");
});

authRouter.post("/singUp", singUp);
authRouter.post("/singIn", singIn);
authRouter.get("/signOut", signOut);
authRouter.post("/sendOtp", sendOtp);
authRouter.post("/verifyOtp", verifyOtp);
authRouter.post("/resetPassword", resetPassword);
authRouter.post("/googleauthSignup",googleAuthSignup);
authRouter.post("/googleSignIn",googleSignIn);
authRouter.post("/verifyOtpSignup",verifyOtpSignup );

export default authRouter;