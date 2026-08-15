import {Router} from "express";
import BudgetController from "../controllers/budget.controller.js";

const router = Router();

// POST /api/budgets
router.post('/', BudgetController.upsert);

export default router;
