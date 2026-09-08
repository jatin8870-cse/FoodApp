import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js"
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";


const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://food-app-gamma-hazel.vercel.app"
    ],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Server is working");
});


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item",itemRouter)

app.listen(port, () => {
    connectDb();
  console.log(`Server is running on port ${port}`);
});