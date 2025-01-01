import {Router} from "express";
import BudgetController from "../controllers/budget.controller";

const router = Router();

// POST /api/budgets
router.post('/', BudgetController.upsert);

export default router;
