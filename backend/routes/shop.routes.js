import express from "express";
import { createEditShop, deleteShop, getMyShop, getshopByCity } from "../controllers/shop.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/mullter.js";




const shopRouter = express.Router();
shopRouter.post("/createedit",isAuth,upload.single("image"), createEditShop);
shopRouter.get("/get-my",isAuth,getMyShop)
shopRouter.get("/get-by-city/:city",getshopByCity)
shopRouter.delete("/delete-shop/:id",deleteShop)
export default shopRouter;