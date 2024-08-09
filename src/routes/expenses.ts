import {Router} from "express";
import ExpenseController from "../controllers/expense.controller";

const router = Router();

// /api/expenses
router.post('/', ExpenseController.createExpense);

export default router;
