import express, { application } from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

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

// GET ALL TRANSACTIONS
app.get("/api/transactions", async (req, res) => {
	try {
		const transactionData = await sql`
	SELECT * FROM transactions
	`;

		console.log(transactionData);

		res.json({ message: "Success", data: transactionData });
	} catch (error) {
		console.error("Error while getting transaction list", error);
		res
			.status(500)
			.json({ message: "Something went wrong", error: error.message });
	}
});

// QUERY TRANSACTION WITH USER_ID
app.get("/api/transactions/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const transactionData =
			await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
		res.status(200).json({ message: "Success", data: transactionData });
	} catch (error) {
		console.error("Error while getting transaction data", error);
		res
			.status(500)
			.json({ message: "Something went wrong", error: error.message });
	}
});

// QUERY AND DELETE TRANSACTION WITH USER_ID
app.delete("/api/transactions/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result =
			await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

		if (result.length === 0) {
			return res.status(404).json({ message: "Transaction Not Found" });
		}

		res.status(200).json({ message: "Transaction Deleted Successfully" });
	} catch (error) {
		console.error("Error while delete data", error);
		res
			.status(500)
			.json({ message: "Something went wrong", error: error.message });
	}
});

// POST TRANSACTIONS
app.post("/api/transactions", async (req, res) => {
	try {
		const { title, amount, category, user_id } = req.body;

		if (!title || amount === undefined || !category || !user_id) {
			return res.status(400).json({ message: "All fields are required!" });
		}

		const transaction = await sql`
		INSERT INTO transactions(user_id, title, amount, category)
		VALUES (${user_id}, ${title}, ${amount}, ${category})
		RETURNING *
		`;

		res
			.status(201)
			.json({ message: "New Transaction Created", data: transaction });
	} catch (error) {
		console.error("Error while creating data", error);
		res
			.status(500)
			.json({ message: "Something went wrong", error: error.message });
	}
});

// UPDATE TRANSACTIONS
app.put("/api/transactions/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { title, amount, category, user_id } = req.body;

		if (!title || amount === undefined || !category || !user_id) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const updatedTransaction = await sql`
		UPDATE transactions SET title=${title}, amount=${amount}, category=${category}, user_id=${user_id} WHERE id= ${id} RETURNING *
		`;

		res
			.status(201)
			.json({ message: "Transaction Updated", data: updatedTransaction });
	} catch (error) {
		console.error("Error while updating data", error);
		res
			.status(500)
			.json({ message: "Something went wrong", error: error.message });
	}
});

initializeDB().then(() => {
	app.listen(port, () => {
		console.log("Express App Is Running in Port", port);
	});
});
