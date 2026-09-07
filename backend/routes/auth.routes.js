import express from "express";
import { singUp, singIn, signOut } from "../controllers/auth.controllers.js";
import { sendOtp, verifyOtp, resetPassword,googleAuth,becomeOwner,verifyOwnerOtp} from "../controllers/auth.controllers.js";
import isAuth from "../middlewares/isAuth.js";

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
authRouter.post("/googleauth",googleAuth );
authRouter.post("/become-owner",isAuth,becomeOwner);
authRouter.post("/verify-owner-otp",isAuth,verifyOwnerOtp);



export default authRouter;