import {Router} from "express";
import PassiveIncomeController from "../controllers/passiveIncome.controller";

const router = Router();

// GET /api/passive-income
router.get('/', PassiveIncomeController.getPassiveIncomes);
// POST /api/passive-income
router.post('/', PassiveIncomeController.createPassiveIncome);
// PUT /api/passive-income/123
router.put('/:id', PassiveIncomeController.updatePassiveIncome);
// GET /api/passive-income/123
router.get('/:id', PassiveIncomeController.getPassiveIncome)
// DEL /api/passive-income/123
router.delete('/:id', PassiveIncomeController.deletePassiveIncome)

export default router;