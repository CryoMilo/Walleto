import { sql } from "../config/db.js";

export const getAllTransactions = async (req, res) => {
	try {
		const transactionData = await sql`
		SELECT * FROM transactions
		`;

		res.json({ message: "Success", data: transactionData });
	} catch (error) {
		console.error("Error while getting transaction list", error);
		res
			.status(500)
			.json({ message: "Something went wrong", error: error.message });
	}
};

export const getTransactionsByUserId = async (req, res) => {
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
};

export const deleteTransactionByUserId = async (req, res) => {
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
};

export const postTransaction = async (req, res) => {
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
};

export const updateTransaction = async (req, res) => {
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
};

export const getTransactionSummaryByUserId = async (req, res) => {
	try {
		const { userId } = req.params;

		const balanceResult = await sql`
		SELECT COALESCE(sum(amount), 0) as balance FROM transactions WHERE user_id = ${userId} 
		`;

		const incomeResult = await sql`
		SELECT COALESCE(sum(amount) , 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
		`;

		const expenseResult = await sql`
		SELECT COALESCE(sum(amount) , 0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0
		`;

		res.status(200).json({
			data: {
				balance: balanceResult[0].balance,
				income: incomeResult[0].income,
				expense: expenseResult[0].expense,
			},
		});
	} catch (error) {}
};
