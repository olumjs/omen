import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./db";
import routes from "./routes"

const { PORT = 3000, CLIENT_URL } = process.env;
const app = express();

// middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

// routes
app.use(routes);
app.use(express.static(path.join(__dirname, "./client")));

// 404 + error handler
app.use((req, res) => res.status(404).json({ error: true, message: "Not found" }));
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: true, message: err.message || "Server error" });
};
app.use(errorHandler);

// init server
connectDB().then(() => app.listen(PORT, () => console.log(`Server started on port ${PORT}`)));
