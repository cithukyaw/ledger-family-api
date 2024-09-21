import {Router} from "express";
import ExpenseController from "../controllers/expense.controller";

const router = Router();

// GET /api/expenses
router.get('/', ExpenseController.getExpenses);
// POST /api/expenses
router.post('/', ExpenseController.createExpense);
// GET /api/expenses/payment-types
router.get('/payment-types', ExpenseController.getPaymentTypes);
// /api/expenses/123
router.delete('/:id', ExpenseController.deleteExpense)

export default router;
