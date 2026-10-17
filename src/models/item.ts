import { model, Schema } from "mongoose";

const itemSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, default: "" },
	},
	{ timestamps: true }
);

export default model("Item", itemSchema);
