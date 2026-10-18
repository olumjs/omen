const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const router = Router();

// route files are .ts in dev (tsx) and .js after build (tsc)
const EXTS = [".ts", ".js"];

// mount every route file in this folder at /api/<file name>, except index
fs.readdirSync(__dirname).forEach((file) => {
	const ext = path.extname(file);
	const name = path.basename(file, ext);
	if (!EXTS.includes(ext) || name === "index" || file.endsWith(".d.ts")) return;
	const route = require(path.join(__dirname, file));
	router.use(`/api/${name}`, route.default || route);
});

module.exports = router;
