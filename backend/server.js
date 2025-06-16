import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(rateLimiter);

const port = process.env.PORT || 5001;

// table
// -------
// id serial primay_key
// user_id varchar
// title varchar
// amount decimal
// category varchar
// created_at Date

// INITIALIZE DATABASE
async function initializeDB() {
	try {
		await sql`CREATE TABLE IF NOT EXISTS transactions(
			id SERIAL PRIMARY KEY,
			user_id VARCHAR(255) NOT NULL,
			title VARCHAR(255) NOT NULL,
			amount DECIMAL(10,2) NOT NULL,
			category VARCHAR(255) NOT NULL,
			created_at DATE NOT NULL DEFAULT CURRENT_DATE
		)`;

		console.log("database initialized successfully");
	} catch (error) {
		console.log("Error initializing Database", error);
		process.exit(1);
	}
}

app.use("/api/transactions", transactionRoutes);

initializeDB().then(() => {
	app.listen(port, () => {
		console.log("Express App Is Running in Port", port);
	});
});
