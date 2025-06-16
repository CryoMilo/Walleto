import express from "express";
import {
	deleteTransactionByUserId,
	getAllTransactions,
	getTransactionsByUserId,
	getTransactionSummaryByUserId,
	postTransaction,
	updateTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

// GET ALL TRANSACTIONS
router.get("/", getAllTransactions);

// QUERY TRANSACTION WITH USER_ID
router.get("/:userId", getTransactionsByUserId);

// QUERY AND DELETE TRANSACTION WITH USER_ID
router.delete("/:id", deleteTransactionByUserId);

// POST TRANSACTIONS
router.post("/", postTransaction);

// UPDATE TRANSACTIONS
router.put("/:id", updateTransaction);

// GET TRANSACTION SUMMARY BY USERID
router.get("/summary/:userId", getTransactionSummaryByUserId);

export default router;
