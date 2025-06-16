import { neon } from "@neondatabase/serverless";
import "dotenv/config";

export const sql = neon(process.env.DATABASE_URL);

// table
// -------
// id serial primay_key
// user_id varchar
// title varchar
// amount decimal
// category varchar
// created_at Date

// INITIALIZE DATABASE
export async function initializeDB() {
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
