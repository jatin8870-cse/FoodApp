import express from "express";
import Item from "../models/item.model.js";

import isAuth from "../middlewares/isAuth.js";
import { addItem, editItems, getItemById } from "../controllers/item.controllers.js";
import { upload } from "../middlewares/mullter.js";



const itemRouter = express.Router();
itemRouter.post("/additem",isAuth,upload.single("image"),addItem );
itemRouter.post("/edititem/:itemId",isAuth,upload.single("image"),editItems);
itemRouter.get("/get-by-id/:itemId",isAuth,getItemById);
export default itemRouter;