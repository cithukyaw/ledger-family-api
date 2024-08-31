import {Router} from "express";
import ExpenseController from "../controllers/expense.controller";

const router = Router();

// /api/expenses
router.post('/', ExpenseController.createExpense);
// /api/expenses/payment-types
router.get('/payment-types', ExpenseController.getPaymentTypes);

export default router;
