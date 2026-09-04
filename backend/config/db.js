import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log("MONGODB_URL =", process.env.MONGODB_URL);

        await mongoose.connect(process.env.MONGODB_URL);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDb;