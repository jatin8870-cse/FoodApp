import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (file) => {
    try {
        console.log("FILE:", file);
        console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
        console.log("API KEY EXISTS:", !!process.env.CLOUDINARY_API_KEY);
        console.log("API SECRET EXISTS:", !!process.env.CLOUDINARY_API_SECRET);

        console.log("BEFORE UPLOAD");

        const result = await cloudinary.uploader.upload(file);

        console.log("UPLOAD SUCCESS:", result.secure_url);

        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }

        return result.secure_url;

    } catch (error) {
        console.log("UPLOAD ERROR");
        console.log("MESSAGE:", error.message);
        console.log("CODE:", error.http_code);

        return null;
    }
};

export default uploadOnCloudinary;