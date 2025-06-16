import express from "express";
import dotenv from "dotenv";
import { rateLimiter } from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { initializeDB } from "./config/db.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(rateLimiter);

const port = process.env.PORT || 5001;

app.use("/api/transactions", transactionRoutes);

initializeDB().then(() => {
	app.listen(port, () => {
		console.log("Express App Is Running in Port", port);
	});
});
