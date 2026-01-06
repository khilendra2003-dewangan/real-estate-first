import mongoose from "mongoose";

const connectDB = async () => {
    const url = process.env.MONGODB_URL;
    if (!url) {
        throw new Error("MONGODB_URL is not defined in the .env file")
    }
    try {
        await mongoose.connect(url, {
            dbName: 'RealEstateApp'
        })
        console.log("✅ MongoDB connected successfully")
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        console.error("   Make sure MongoDB is running locally or update MONGODB_URL in .env");
        process.exit(1);
    }
}
export default connectDB;