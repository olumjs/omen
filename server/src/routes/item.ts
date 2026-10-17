import { Router } from "express";
import Item from "../models/item";

const router = Router();

router.get("/", async (req, res) => {
	res.json(await Item.find().sort({ createdAt: -1 }));
});

router.get("/:id", async (req, res) => {
	const item = await Item.findById(req.params.id);
	if (!item) return res.status(404).json({ error: true, message: "Item not found" });
	res.json(item);
});

router.post("/", async (req, res) => {
	res.status(201).json(await Item.create(req.body));
});

router.put("/:id", async (req, res) => {
	const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	if (!item) return res.status(404).json({ error: true, message: "Item not found" });
	res.json(item);
});

router.delete("/:id", async (req, res) => {
	const item = await Item.findByIdAndDelete(req.params.id);
	if (!item) return res.status(404).json({ error: true, message: "Item not found" });
	res.status(204).end();
});

export default router;
