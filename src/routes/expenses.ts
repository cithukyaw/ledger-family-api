import {Router} from "express";
import ExpenseController from "../controllers/expense.controller";

const router = Router();

// GET /api/expenses
router.get('/', ExpenseController.getExpenses);
// POST /api/expenses
router.post('/', ExpenseController.createExpense);
// PUT /api/expenses/123
router.put('/:id', ExpenseController.updateExpense);
// GET /api/expenses/payment-types
router.get('/payment-types', ExpenseController.getPaymentTypes);
// GET /api/expenses/123
router.get('/:id', ExpenseController.getExpense)
// DEL /api/expenses/123
router.delete('/:id', ExpenseController.deleteExpense)

export default router;
