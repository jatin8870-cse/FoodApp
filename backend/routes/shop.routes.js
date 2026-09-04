import express from "express";
import { createEditShop, getMyShop } from "../controllers/shop.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/mullter.js";




const shopRouter = express.Router();
shopRouter.post("/createedit",isAuth,upload.single("image"), createEditShop);
shopRouter.get("/get-my",isAuth,getMyShop)

export default shopRouter;