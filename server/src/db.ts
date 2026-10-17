import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/app");
		console.log("Connected to DB.");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
